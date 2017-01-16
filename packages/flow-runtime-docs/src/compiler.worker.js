/* @flow */

declare var self: DedicatedWorkerGlobalScope;

import {parse} from 'babylon';
import transform from 'babel-plugin-flow-runtime/lib/transform';
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

function transformFlowRuntime (ast: AST, input: string, options: Object): string {
  transform(ast, options);

  const {code} = Babel.transformFromAst(ast, input, { plugins: ['transform-flow-strip-types']});
  return code;
}

function compileBabel (ast: AST, input: string): string {
  const {code} = Babel.transformFromAst(ast, input, { presets: [['es2015', {generators: false}], 'stage-0', 'react']});
  return code;
}


(self: any).addEventListener('message', (event: MessageEvent) => {
  const [id, input, options] = (event: any).data;
  let ast;
  let result;
  try {
    ast = getAST(input);
    result = [
      id,
      transformFlowRuntime(ast, input, options),
      compileBabel(ast, input)
    ];
  }
  catch (e) {
    result = [
      id,
      '',
      '',
      e.stack
    ];
  }
  self.postMessage(result);
}, false);