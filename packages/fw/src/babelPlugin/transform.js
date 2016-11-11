/* @flow */
import traverse from 'babel-traverse';

import ConversionContext from './ConversionContext';

import firstPassVisitors from './firstPassVisitors';
import transformVisitors from './transformVisitors';
import type {Node} from 'babel-traverse';

export default function transform (input: Node): Node {
  const context = new ConversionContext();

  traverse(input, firstPassVisitors(context));
  traverse(input, transformVisitors(context));

  return input;
}
