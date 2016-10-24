/* @flow */
import * as t from 'babel-types';
import type {NodePath} from 'babel-traverse';

import getTypeParameters from './getTypeParameters';
import type ConversionContext from './ConversionContext';

export default function firstPassVisitors (context: ConversionContext): Object {
  return {
    TypeAlias (path: NodePath) {
      context.defineTypeAlias(path.node.id.name, path);
    },
    InterfaceDeclaration (path: NodePath) {
      context.defineTypeAlias(path.node.id.name, path);
    },
    ImportDeclaration (path: NodePath) {
      path.get('specifiers').forEach(specifier => {
        const local = specifier.get('local');
        const {name} = local.node;
        if (path.node.importKind === 'type') {
          context.defineTypeAlias(name, specifier);
        }
        else {
          context.defineValue(name, path);
        }
      });
    },
    VariableDeclarator (path: NodePath) {
      const {name} = path.node.id;
      context.defineValue(name, path);
    },
    Function (path: NodePath) {
      if (path.isFunctionDeclaration()) {
        const {name} = path.node.id;
        context.defineValue(name, path);
      }
      const params = path.get('params').filter(hasTypeAnnotation);
      const typeParameters = getTypeParameters(path);
      if (path.has('returnType') || params.length || typeParameters.length) {
        let body = path.get('body');

        if (!body.isBlockStatement()) {
          // Expand arrow function expressions
          body.replaceWith(t.blockStatement([
            t.returnStatement(body.node)
          ]));
          body = path.get('body');
        }

        typeParameters.forEach(item => {
          const {name} = item.node;
          context.defineTypeParameter(name, item);
        });
        params.forEach(param => {
          context.defineTypeAlias(param.node.name, param);
        });
      }
    },
    Class (path: NodePath) {
      if (path.isClassDeclaration()) {
        const {name} = path.node.id;
        context.defineValue(name, path);
      }
      const body = path.get('body');
      getTypeParameters(path).forEach(item => {
        const {name} = item.node;
        context.defineClassTypeParameter(name, item);
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
