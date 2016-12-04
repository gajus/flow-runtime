/* @flow */

import ConversionContext from './ConversionContext';

import attachImport from './attachImport';
import firstPassVisitors from './firstPassVisitors';
import transformVisitors from './transformVisitors';
import type {NodePath} from 'babel-traverse';


export default function () {
  return {
    visitor: {
      Program (path: NodePath) {
        const context = new ConversionContext();
        attachImport(context, path);
        path.traverse(firstPassVisitors(context));
        path.traverse(transformVisitors(context));
      }
    }
  };
}
