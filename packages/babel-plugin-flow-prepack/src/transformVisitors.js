/* @flow */
import type ConversionContext from './ConversionContext';
import convert from './convert';

import type {NodePath} from 'babel-traverse';


export default function transformVisitors (context: ConversionContext): Object {
  return {
    'Expression|Statement' (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
    },
    'DeclareVariable|DeclareTypeAlias|DeclareFunction|DeclareClass|DeclareModule|InterfaceDeclaration' (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        return;
      }
      const replacement = convert(context, path);
      context.replacePath(path, replacement);
    },
    TypeAlias (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const replacement = convert(context, path);
      context.replacePath(path, replacement);
    },
  };
}
