/* @flow */

import createConversionContext from './createConversionContext';

import collectProgramOptions from './collectProgramOptions';
import firstPassVisitors from './firstPassVisitors';
import transformVisitors from './transformVisitors';
import type {NodePath} from 'babel-traverse';

import transform from './transform';
import findIdentifiers from './findIdentifiers';
import getTypeParameters from './getTypeParameters';

export default function babelPluginFlowPrepack () {
  return {
    visitor: {
      Program (path: NodePath, state: Object) {
        const {opts} = state;
        const context = createConversionContext(opts || {});
        if (!collectProgramOptions(context, path.node)) {
          return;
        }
        path.traverse(firstPassVisitors(context));
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

