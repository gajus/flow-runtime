'use strict';

const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const runtimePlugin = require('babel-plugin-flow-runtime').default;

function resolve (context, request) {
  return new Promise((accept, reject) => {
    context.resolve(context.context, request, (error, result) => {
      if (error) reject(error);
      else accept(result);
    });
  });
}

async function resolveType (context, request) {
  const candidates = request.endsWith('.flow')
    ? [request]
    : [request + '.js.flow', request + '.flow', request];
  let lastError;
  for (const candidate of candidates) {
    try {
      return await resolve(context, candidate);
    }
    catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function compile (context, source) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    sourceFilename: context.resourcePath,
    plugins: ['flow', 'jsx']
  });
  const sources = new Map();
  traverse(ast, {
    ImportDeclaration (nodePath) {
      const node = nodePath.node;
      if (node.importKind === 'type' || node.specifiers.some(item => item.importKind === 'type')) {
        if (node.importKind !== 'type' && node.specifiers.some(item => item.importKind !== 'type')) {
          throw new Error('Separate value and type imports when using flow-runtime-loader.');
        }
        sources.set(node.source, node.source.value);
      }
    },
    ExportNamedDeclaration (nodePath) {
      if (nodePath.node.exportKind === 'type' && nodePath.node.source) {
        sources.set(nodePath.node.source, nodePath.node.source.value);
      }
    },
    ExportAllDeclaration (nodePath) {
      if (nodePath.node.exportKind === 'type') {
        sources.set(nodePath.node.source, nodePath.node.source.value);
      }
    }
  });
  for (const [node, request] of sources) {
    const filename = await resolveType(context, request);
    context.addDependency(filename);
    node.value = '!!' + __filename + '!' + filename;
  }
  const output = babel.transformFromAstSync(ast, source, {
    filename: context.resourcePath,
    sourceFileName: context.resourcePath,
    babelrc: false,
    configFile: false,
    sourceMaps: true,
    plugins: [[runtimePlugin, {assert: false, annotate: false}]]
  });
  return output;
}

module.exports = function flowRuntimeLoader (source) {
  this.cacheable();
  const callback = this.async();
  compile(this, source).then(
    result => callback(null, result.code, result.map),
    error => callback(error)
  );
};
