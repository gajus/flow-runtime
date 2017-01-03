/* @flow */

import {parse} from 'babylon';
import generate from 'babel-generator';
import transform from 'babel-plugin-flow-runtime/lib/transform';
import Recast from 'recast';
import * as Babel from 'babel-standalone';

type AST = {
  type: string;
};

function getAST (input: string): AST {
  return parse(input, {
    filename: 'unknown',
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'doExpressions',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  });
}

function transformFlowRuntime (ast: AST): string {
  transform(ast);
  const {code} = generate(ast, {
    tabWidth: 2
  });
  return code;
}

function compileBabel (ast: AST, input: string): string {
  const {code} = Babel.transformFromAst(ast, input, { presets: ['es2015', 'stage-0', 'react']});
  return code;
}

onmessage = (event) => {
  const input = event.data;
  let ast;
  try {
    ast = getAST(input);
  }
  catch (e) {
    // do nothing
    return;
  }
  postMessage([
    transformFlowRuntime(ast),
    compileBabel(ast, input)
  ]);
};