/* @flow */

import {parse} from 'babylon';
import transform from 'babel-plugin-flow-runtime/lib/transform';
import Recast from 'recast';

onmessage = (event) => {
  const input = event.data;
  try {
    const ast = parse(input, {
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
    transform(ast);
    postMessage(Recast.print(ast, {
      tabWidth: 2
    }).code);
  }
  catch (e) {
    // do nothing
  }
};