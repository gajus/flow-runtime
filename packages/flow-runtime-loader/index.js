'use strict';

const babel = require('@babel/core');
const flowRuntime = require('babel-plugin-flow-runtime');
const stripFlow = require('@babel/plugin-transform-flow-strip-types');
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function flowRuntimeLoader(source, inputSourceMap) {
  if (this.cacheable) this.cacheable();
  const callback = this.async();
  const context = this;

  async function transform() {
    const options = context.getOptions ? context.getOptions() : loaderUtils.getOptions(context) || {};
    // Keep request separators inside JSON strings from changing the loader chain.
    const optionsQuery = JSON.stringify(options).replace(/[!#]/g, character =>
      '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'));
    const parserOptions = {
      sourceType: 'unambiguous',
      plugins: ['flow', 'jsx', 'classProperties', 'objectRestSpread']
    };
    const ast = babel.parseSync(source, {
      filename: context.resourcePath,
      babelrc: false,
      configFile: false,
      parserOpts: parserOptions
    });
    // A mixed import must keep its value bindings on the real JS module.
    // Only its type bindings should be redirected to the declaration module.
    const imports = [];
    ast.program.body = ast.program.body.reduce((body, node) => {
      if (node.type === 'ImportDeclaration' && node.importKind !== 'type') {
        const typeSpecifiers = node.specifiers.filter(specifier => specifier.importKind === 'type');
        if (typeSpecifiers.length) {
          const typeImport = babel.types.importDeclaration(typeSpecifiers, babel.types.cloneNode(node.source));
          typeImport.importKind = 'type';
          typeSpecifiers.forEach(specifier => { specifier.importKind = null; });
          node.specifiers = node.specifiers.filter(specifier => !typeSpecifiers.includes(specifier));
          imports.push(typeImport);
          body.push(typeImport);
          if (!node.specifiers.length) return body;
        }
      }
      if (node.source && (node.importKind === 'type' || node.exportKind === 'type')) imports.push(node);
      body.push(node);
      return body;
    }, []);

    // Type imports must themselves expose runtime types, not ordinary library JS.
    // Resolve each through webpack (including aliases), preferring .js.flow stubs.
    await Promise.all(imports.map(async node => {
      const request = node.source.value;
      if (request.includes('!')) return;
      const directory = path.dirname(context.resourcePath);
      const resolve = candidate => new Promise((resolveRequest, reject) => {
        context.resolve(directory, candidate, (error, result) => error ? reject(error) : resolveRequest(result));
      });
      let resolved;
      try {
        resolved = await resolve(request.endsWith('.flow') ? request : request + '.flow');
      } catch (error) {
        try {
          resolved = await resolve(request + '.js.flow');
        } catch (missingFlowSource) {
          resolved = await resolve(request);
        }
        if (typeof resolved === 'string' && !resolved.endsWith('.flow')) {
          try {
            resolved = await resolve(resolved + '.flow');
          } catch (missingStub) {
            // Flow source without a separate declaration file is also supported.
          }
        }
      }
      if (typeof resolved !== 'string') {
        throw new Error('flow-runtime-loader could not resolve type import: ' + request);
      }
      if (/[!?#]/.test(resolved) || /[!?#]/.test(__filename)) {
        throw new Error('flow-runtime-loader cannot safely encode a type module path containing !, ? or #: ' + resolved);
      }
      context.addDependency(resolved);
      node.source.value = '!!' + __filename + '?' + optionsQuery + '!' + resolved;
    }));

    const result = babel.transformFromAstSync(ast, source, {
      filename: context.resourcePath,
      babelrc: false,
      configFile: false,
      inputSourceMap: inputSourceMap || undefined,
      sourceMaps: Boolean(context.sourceMap),
      sourceFileName: context.resourcePath,
      plugins: [
        [flowRuntime.default || flowRuntime, Object.assign({ assert: true, annotate: false }, options)],
        stripFlow.default || stripFlow
      ]
    });
    callback(null, result.code, result.map);
  }

  transform().catch(error => callback(error));
};
