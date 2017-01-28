/* @flow */

import createConversionContext from './createConversionContext';

import collectProgramOptions from './collectProgramOptions';
import attachImport from './attachImport';
import firstPassVisitors from './firstPassVisitors';
import annotateVisitors from './annotateVisitors';
import patternMatchVisitors from './patternMatchVisitors';
import transformVisitors from './transformVisitors';
import type {NodePath} from 'babel-traverse';

import transform from './transform';
import findIdentifiers from './findIdentifiers';
import getTypeParameters from './getTypeParameters';

export default function babelPluginFlowRuntime () {
  return {
    visitor: {
      Program (path: NodePath, state: Object) {
        const {opts} = state;
        const context = createConversionContext(opts || {});
        if (!collectProgramOptions(context, path.node)) {
          return;
        }
        path.traverse(firstPassVisitors(context));
        if (context.shouldImport) {
          attachImport(context, path);
        }
        path.traverse(patternMatchVisitors(context));
        if (context.shouldAnnotate) {
          context.isAnnotating = true;
          path.traverse(annotateVisitors(context));
          context.isAnnotating = false;
          context.visited = new WeakSet();
        }
        path.traverse(transformVisitors(context));
      }
    }
  };
}


export {
  transform,
  findIdentifiers,
  getTypeParameters
};

