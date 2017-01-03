/* @flow */
import * as t from 'babel-types';
import type {NodePath} from 'babel-traverse';

import getTypeParameters from './getTypeParameters';
import type ConversionContext from './ConversionContext';

export default function firstPassVisitors (context: ConversionContext): Object {
  return {
    Identifier (path: NodePath) {
      if (!context.shouldImport || path.parentPath.isFlow()) {
        return;
      }
      if (path.key === 'property' && path.parentPath.isMemberExpression() && path.parentPath.node.computed) {
        return;
      }
      const {name} = path.node;
      if (name === context.libraryId) {
        context.libraryId = path.scope.generateUid(context.libraryId);
      }
    },
    TypeAlias (path: NodePath) {
      context.defineTypeAlias(path.node.id.name, path);
    },
    InterfaceDeclaration (path: NodePath) {
      context.defineTypeAlias(path.node.id.name, path);
    },
    ImportDeclaration (path: NodePath) {
      const source = path.get('source').node.value;

      const isReact = path.node.importKind === 'value'
                    && (source === 'react' || source === 'preact')
                    ;

      const isFlowRuntime = path.node.importKind === 'value'
                          && source === 'flow-runtime'
                          ;

      if (isReact) {
        path.parentPath.scope.setData('importsReact', true);
      }

      path.get('specifiers').forEach(specifier => {
        const local = specifier.get('local');
        const {name} = local.node;
        if (path.node.importKind === 'type') {
          context.defineImportedType(name, specifier);
        }
        else {
          context.defineValue(name, path);
          if (isReact) {
            if (specifier.isImportDefaultSpecifier()) {
              path.parentPath.scope.setData('reactLib', name);
            }
            else if (specifier.node.imported.name === 'Component') {
              path.parentPath.scope.setData('reactComponentClass', name);
            }
            else if (specifier.node.imported.name === 'PureComponent') {
              path.parentPath.scope.setData('reactPureComponentClass', name);
            }
          }
          else if (isFlowRuntime && specifier.isImportDefaultSpecifier()) {
            context.shouldImport = false;
            context.libraryId = name;
          }
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
        context.defineValue(name, path.parentPath);
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
        context.defineValue(name, path.parentPath);
      }
      const body = path.get('body');
      const typeParameters = getTypeParameters(path);
      typeParameters.forEach(item => {
        const {name} = item.node;
        context.defineClassTypeParameter(name, item);
      });
      if (typeParameters.length > 0 || path.has('superTypeParameters')) {
        ensureConstructor(path);
        path.parentPath.scope.setData('typeParametersUid', path.parentPath.scope.generateUid('typeParameters'));
      }
    }
  };
}


/**
 * Determine whether the given node path has a type annotation or not.
 */
function hasTypeAnnotation (path: NodePath): boolean {
  return path.node && path.node.typeAnnotation ? true : false;
}

/**
 * Ensure that the given class contains a constructor.
 */
function ensureConstructor (path: NodePath) {
  let lastProperty;
  const [existing] = path.get('body.body').filter(
    item => {
      if (item.isClassProperty()) {
        lastProperty = item;
        return false;
      }
      return item.node.kind === 'constructor';
    }
  );
  if (existing) {
    return existing;
  }
  let constructorNode;
  if (path.has('superClass')) {
    const args = t.identifier('args');
    constructorNode = t.classMethod(
      'constructor',
      t.identifier('constructor'),
      [t.restElement(args)],
      t.blockStatement([
        t.expressionStatement(
          t.callExpression(
            t.super(),
            [t.spreadElement(args)]
          )
        )
      ])
    );

  }
  else {
    constructorNode = t.classMethod(
      'constructor',
      t.identifier('constructor'),
      [],
      t.blockStatement([])
    );
  }

  if (lastProperty) {
    lastProperty.insertAfter(constructorNode);
  }
  else {
    path.get('body').unshiftContainer('body', constructorNode);
  }
}
