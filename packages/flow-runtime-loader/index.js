'use strict';

const path = require('path');
const babel = require('@babel/core');
const runtimePlugin = require('babel-plugin-flow-runtime');
const stripTypes = require('@babel/plugin-transform-flow-strip-types');
const loaderUtils = require('loader-utils');

function resolveRequest(context, request) {
  return new Promise((resolve, reject) => {
    context.resolve(path.dirname(context.resourcePath), request, (error, result) => {
      if (error) return reject(error);
      if (typeof result !== 'string') {
        return reject(new Error('Type module is disabled or not a file: ' + request));
      }
      resolve(result);
    });
  });
}

async function resolveType(context, request) {
  let resolved;
  try {
    resolved = await resolveRequest(context, request);
  } catch (error) {
    // An alias explicitly disabled by webpack must not be resurrected by a stub.
    if (/Type module is disabled/.test(error.message)) throw error;
    const candidates = request.endsWith('.flow') ? [] :
      request.endsWith('.js') ? [request + '.flow'] : [request + '.js.flow', request + '.flow'];
    for (const candidate of candidates) {
      try {
        resolved = await resolveRequest(context, candidate);
        break;
      } catch (candidateError) {
        if (/Type module is disabled/.test(candidateError.message)) throw candidateError;
      }
    }
    if (!resolved) throw error;
  }
  if (!resolved.endsWith('.flow')) {
    try {
      resolved = await resolveRequest(context, resolved + '.flow');
    } catch (error) {
      // An annotated source module is also usable when it has no sibling stub.
      if (/Type module is disabled/.test(error.message)) throw error;
    }
  }
  return resolved;
}

function typeDependencies(ast) {
  const dependencies = [];
  const body = [];
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration' && node.importKind !== 'type') {
      const types = node.specifiers.filter(item => item.importKind === 'type');
      if (types.length) {
        const typeImport = babel.types.cloneNode(node, true);
        typeImport.specifiers = types.map(item => {
          const copy = babel.types.cloneNode(item, true);
          copy.importKind = null;
          return copy;
        });
        typeImport.importKind = 'type';
        node.specifiers = node.specifiers.filter(item => item.importKind !== 'type');
        dependencies.push(typeImport);
        body.push(typeImport);
        if (!node.specifiers.length) continue;
      }
    }
    if (node.source && (node.importKind === 'type' || node.exportKind === 'type')) {
      dependencies.push(node);
    }
    body.push(node);
  }
  ast.program.body = body;
  return dependencies;
}

function encodeOptions(options) {
  return JSON.stringify(options).replace(/[!?#]/g, character =>
    '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'));
}

module.exports = function flowRuntimeLoader(source, inputSourceMap) {
  if (this.cacheable) this.cacheable();
  const callback = this.async();
  const context = this;

  async function convert() {
    const options = context.getOptions ? context.getOptions() : loaderUtils.getOptions(context) || {};
    const text = Buffer.isBuffer(source) ? source.toString('utf8') : source;
    const ast = babel.parseSync(text, {
      filename: context.resourcePath,
      babelrc: false,
      configFile: false,
      parserOpts: {sourceType: 'module', plugins: ['flow', 'jsx']}
    });
    const dependencies = typeDependencies(ast);
    for (const declaration of dependencies) {
      const request = declaration.source.value;
      if (request.includes('!')) continue;
      const resolved = await resolveType(context, request);
      if (/[!?#]/.test(resolved) || /[!?#]/.test(__filename)) {
        throw new Error('Cannot represent a type module path in a webpack request: ' + resolved);
      }
      context.addDependency(resolved);
      declaration.source.value = '!!' + __filename + '?' + encodeOptions(options) + '!' + resolved;
    }
    const result = babel.transformFromAstSync(ast, text, {
      filename: context.resourcePath,
      babelrc: false,
      configFile: false,
      inputSourceMap: inputSourceMap || undefined,
      sourceMaps: Boolean(context.sourceMap),
      sourceFileName: context.resourcePath,
      plugins: [
        [runtimePlugin.default || runtimePlugin, Object.assign({assert: true, annotate: false}, options)],
        stripTypes.default || stripTypes
      ]
    });
    return result;
  }

  convert().then(result => callback(null, result.code, result.map), error => callback(error));
};
