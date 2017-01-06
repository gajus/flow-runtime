/* @flow */
import traverse from 'babel-traverse';

import firstPassVisitors from './firstPassVisitors';
import transformVisitors from './transformVisitors';
import type {Node} from 'babel-traverse';

import createConversionContext from './createConversionContext';
import type {Options} from './createConversionContext';

export default function transform (input: Node, options: Options = {}): Node {
  const context = createConversionContext(options);
  traverse(input, firstPassVisitors(context));
  traverse(input, transformVisitors(context));

  return input;
}
