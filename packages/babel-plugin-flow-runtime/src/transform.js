/* @flow */
import traverse from '@babel/traverse';

import collectProgramOptions from './collectProgramOptions';
import firstPassVisitors from './firstPassVisitors';
import patternMatchVisitors from './patternMatchVisitors';
import annotateVisitors from './annotateVisitors';
import preTransformVisitors from './preTransformVisitors';
import transformVisitors from './transformVisitors';
import type {Node, NodePath} from '@babel/traverse';

import createConversionContext from './createConversionContext';
import type {Options} from './createConversionContext';

export default function transform (input: Node, options: Options = {}, scope?: Object, state?: Object, parentPath?: NodePath): Node {
  const context = createConversionContext(options);
  if (!collectProgramOptions(context, input)) {
    return input;
  }
  traverse(input, firstPassVisitors(context), scope, state, parentPath);
  traverse(input, patternMatchVisitors(context), scope, state, parentPath);
  if (context.shouldAnnotate) {
    context.isAnnotating = true;
    traverse(input, annotateVisitors(context), scope, state, parentPath);
    context.isAnnotating = false;
    context.visited = new WeakSet();
  }
  traverse(input, preTransformVisitors(context), scope, state, parentPath);
  traverse(input, transformVisitors(context), scope, state, parentPath);

  return input;
}
