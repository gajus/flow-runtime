/* @flow */
import * as t from '@babel/types';

import typeAnnotationIterator from './typeAnnotationIterator';
import type ConversionContext from './ConversionContext';
import convert from './convert';

import getTypeParameters from './getTypeParameters';
import {ok as invariant} from 'assert';
import type {Node, NodePath} from '@babel/traverse';


export default function transformVisitors (context: ConversionContext): Object {
  const shouldCheck = context.shouldAssert || context.shouldWarn;
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
