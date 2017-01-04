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
    allowReturnOutsideFunction: true,
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

function transformFlowRuntime (ast: AST, options: Object): string {
  transform(ast, options);
  try {
    const {code} = Recast.print(ast, {
      tabWidth: 2
    });
    return code;
  }
  catch (e) {
    // fall-back to babel.
    const {code} = generate(ast, {
      tabWidth: 2
    });
    return code;
  }
}

function compileBabel (ast: AST, input: string): string {
  const {code} = Babel.transformFromAst(ast, input, { presets: ['es2015', 'stage-0', 'react']});
  return code;
}

function removeComments (code: string): string {
  return code.replace(/^\/\/(.*)$/gm, '').trim();
}

onmessage = (event) => {
  const [id, input, options] = event.data;
  let ast;
  let result;
  try {
    ast = getAST(input);
    result = [
      id,
      removeComments(transformFlowRuntime(ast, options)),
      compileBabel(ast, input)
    ];
  }
  catch (e) {
    result = [
      id,
      '',
      '',
      e.message
    ];
  }
  postMessage(result);
};