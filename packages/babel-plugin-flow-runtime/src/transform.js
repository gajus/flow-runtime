/* @flow */
import traverse from 'babel-traverse';

import collectProgramOptions from './collectProgramOptions';
import firstPassVisitors from './firstPassVisitors';
import patternMatchVisitors from './patternMatchVisitors';
import transformVisitors from './transformVisitors';
import type {Node} from 'babel-traverse';

import createConversionContext from './createConversionContext';
import type {Options} from './createConversionContext';

export default function transform (input: Node, options: Options = {}): Node {
  const context = createConversionContext(options);
  if (!collectProgramOptions(context, input)) {
    return input;
  }
  traverse(input, firstPassVisitors(context));
  traverse(input, patternMatchVisitors(context));
  traverse(input, transformVisitors(context));

  return input;
}
