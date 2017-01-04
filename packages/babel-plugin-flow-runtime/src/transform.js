/* @flow */
import traverse from 'babel-traverse';

import ConversionContext from './ConversionContext';

import firstPassVisitors from './firstPassVisitors';
import transformVisitors from './transformVisitors';
import type {Node} from 'babel-traverse';

export type Options = {
  assert?: boolean;
  decorate?: boolean;
};

export default function transform (input: Node, options: Options = {}): Node {
  const context = new ConversionContext();
  context.shouldAssert = options.assert === 'undefined'
                       ? process.env.NODE_ENV === 'development'
                       : Boolean(options.assert)
                       ;
  context.shouldDecorate = options.decorate === 'undefined' || context.shouldAssert
                         ? true
                         : Boolean(options.decorate)
                         ;

  traverse(input, firstPassVisitors(context));
  traverse(input, transformVisitors(context));

  return input;
}
