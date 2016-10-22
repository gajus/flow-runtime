/* @flow */
import * as t from 'babel-types';
import type {NodePath} from 'babel-traverse';

import getTypeParameters from './getTypeParameters';
import type ConversionContext from './ConversionContext';

export default function firstPassVisitors (context: ConversionContext): Object {
  return {
    TypeAlias (path: NodePath) {
      getTypeParameters(path).forEach(item => {
        const {name} = item.node;
        path.scope.setData(`typeparam:${name}`, item);
      });
      path.scope.setData(
        `typealias:${path.node.id.name}`,
        path
      );
    },
    InterfaceDeclaration (path: NodePath) {
      getTypeParameters(path).forEach(item => {
        const {name} = item.node;
        path.scope.setData(`typeparam:${name}`, item);
      });
      path.scope.setData(
        `typealias:${path.node.id.name}`,
        path
      );
    },
    ImportDeclaration (path: NodePath) {
      path.get('specifiers').forEach(specifier => {
        const local = specifier.get('local');
        const {name} = local.node;
        if (path.node.importKind === 'type') {
          path.scope.setData(`typealias:${name}`, specifier);
        }
        else {
          path.scope.setData(`valuetype:${name}`, path);
        }
      });
    },
    VariableDeclarator (path: NodePath) {
      const {name} = path.node.id;
      path.scope.setData(`valuetype:${name}`, path);
    },
    Function (path: NodePath) {
      if (path.isFunctionDeclaration()) {
        const {name} = path.node.id;
        path.scope.setData(`valuetype:${name}`, path);
      }
      const body = path.get('body');
      getTypeParameters(path).forEach(item => {
        const {name} = item.node;
        body.scope.setData(`typeparam:${name}`, item);
      });
      path.get('params').filter(hasTypeAnnotation).forEach(param => {
        body.scope.setData(`typealias:${param.node.name}`, param);
      });
    },
    Class (path: NodePath) {
      if (path.isClassDeclaration()) {
        const {name} = path.node.id;
        path.scope.setData(`valuetype:${name}`, path);
      }
      const body = path.get('body');
      getTypeParameters(path).forEach(item => {
        const {name} = item.node;
        body.scope.setData(`typeparam:${name}`, item);
      });
    }
  };
}


/**
 * Determine whether the given node path has a type annotation or not.
 */
function hasTypeAnnotation (path: NodePath): boolean {
  return path.node && path.node.typeAnnotation ? true : false;
}
