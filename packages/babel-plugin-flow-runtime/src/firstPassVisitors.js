/* @flow */
import * as t from '@babel/types';
import type {NodePath} from '@babel/traverse';

import attachImport from './attachImport';
import getTypeParameters from './getTypeParameters';
import type ConversionContext from './ConversionContext';

import findIdentifiers from './findIdentifiers';

export default function firstPassVisitors (context: ConversionContext): Object {

  return {
    Program: {
      exit (path: NodePath) {
        if (context.shouldImport) {
          attachImport(context, path);
        }
      }
    },
    GenericTypeAnnotation (path: NodePath) {
      const id = path.get('id');
      path.scope.setData(`seenReference:${id.node.name}`, true);
    },
    Identifier (path: NodePath) {
      const {parentPath} = path;

      if (parentPath.isFlow()) {
        // This identifier might point to a type that has not been resolved yet
        if (parentPath.isTypeAlias() || parentPath.isInterfaceDeclaration()) {
          if (path.key === 'id') {
            return; // this is part of the declaration name
          }
        }
        if (context.hasTDZIssue(path.node.name, path)) {
          context.markTDZIssue(path.node);
        }
        return;
      }
      else if (!context.shouldImport) {
        return;
      }
      if (path.key === 'property' && parentPath.isMemberExpression() && parentPath.node.computed) {
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

      const isReact = path.node.importKind !== 'type'
                    && (source === 'react' || source === 'preact')
                    ;

      const isFlowRuntime = path.node.importKind !== 'type'
                          && source === 'flow-runtime'
                          ;

      if (isReact) {
        path.parentPath.scope.setData('importsReact', true);
      }

      for (const specifier of path.get('specifiers')) {
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
            else if (specifier.isImportNamespaceSpecifier()) {
              path.parentPath.scope.setData('reactLib', name);
            }
            else if (specifier.node.imported.name === 'Component') {
              path.parentPath.scope.setData('reactComponentClass', name);
            }
            else if (specifier.node.imported.name === 'PureComponent') {
              path.parentPath.scope.setData('reactPureComponentClass', name);
            }
          }
          else if (isFlowRuntime && (specifier.isImportDefaultSpecifier() || specifier.isImportNamespaceSpecifier())) {
            context.shouldImport = false;
            context.libraryId = name;
          }
        }
      }

      context.lastImportDeclaration = path;
    },
    VariableDeclarator (path: NodePath) {
      for (const id of findIdentifiers(path.get('id'))) {
        const {name} = id.node;
        context.defineValue(name, path);
      }
    },
    Function (path: NodePath) {
      if (path.isFunctionDeclaration() && path.has('id')) {
        const {name} = path.node.id;
        context.defineValue(name, path.parentPath);
      }
      const params = path.get('params').filter(hasTypeAnnotation);
      const typeParameters = getTypeParameters(path);
      let body = path.get('body');
      if (path.node.generator && path.node.returnType) {
        const yieldTypeUid = body.scope.generateUidIdentifier('yieldType');
        body.scope.setData(`yieldTypeUid`, yieldTypeUid);
        const returnTypeUid = body.scope.generateUidIdentifier('returnType');
        body.scope.setData(`returnTypeUid`, returnTypeUid);
        const nextTypeUid = body.scope.generateUidIdentifier('nextType');
        body.scope.setData(`nextTypeUid`, nextTypeUid);
      }
      else if (path.node.async && path.node.returnType) {
        const returnTypeUid = body.scope.generateUidIdentifier('returnType');
        body.scope.setData(`returnTypeUid`, returnTypeUid);
      }

      if (path.has('returnType') || params.length || typeParameters.length) {
        if (!body.isBlockStatement()) {
          // Expand arrow function expressions
          body.replaceWith(t.blockStatement([
            t.returnStatement(body.node)
          ]));
          body = path.get('body');
          // BABEL7
          path.node.expression = false;
        }

        typeParameters.forEach(item => {
          const {name} = item.node;
          context.defineTypeParameter(name, item);
        });
        for (const id of findIdentifiers(params)) {
          context.defineTypeAlias(id.node.name, id);
        }
      }
    },
    Class (path: NodePath) {
      let className = 'AnonymousClass';
      if (path.isClassDeclaration() && path.has('id')) {
        const {name} = path.node.id;
        // have we seen a reference to this class already?
        // if so we should replace it with a `var className = class className {}`
        // to avoid temporal dead zone issues
        if (!path.parentPath.isExportDefaultDeclaration() && path.scope.getData(`seenReference:${name}`)) {
          path.replaceWith(t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(name),
              t.classExpression(
                path.node.id,
                path.node.superClass,
                path.node.body,
                path.node.decorators || []
              )
            )
          ]));
          return;
        }
        className = name;
        context.defineValue(name, path.parentPath);
      }
      context.setClassData(
        path,
        'currentClassName',
        className
      );
      const typeParameters = getTypeParameters(path);
      typeParameters.forEach(item => {
        const {name} = item.node;
        context.defineClassTypeParameter(name, item);
      });
      if (typeParameters.length > 0 || path.has('superTypeParameters')) {
        ensureConstructor(path);
        context.setClassData(
          path,
          'typeParametersUid',
          path.parentPath.scope.generateUid(`_typeParameters`)
        );
      }
      else if (path.has('implements') && (context.shouldAssert || context.shouldWarn)) {
        ensureConstructor(path);
      }

      if (typeParameters.length > 0) {
        context.setClassData(
          path,
          'typeParametersSymbolUid',
          path.parentPath.scope.generateUid(`${className}TypeParametersSymbol`)
        );
      }
      else {
        context.setClassData(
          path,
          'typeParametersSymbolUid',
          ''
        );
      }
    }
  };
}


/**
 * Determine whether the given node path has a type annotation or not.
 */
function hasTypeAnnotation (path: NodePath): boolean {
  if (!path.node) {
    return false;
  }
  else if (path.node.typeAnnotation) {
    return true;
  }
  else if (path.isAssignmentPattern()) {
    return hasTypeAnnotation(path.get('left'));
  }
  else {
    return false;
  }
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
