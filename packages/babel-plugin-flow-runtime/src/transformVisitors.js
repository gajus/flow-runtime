/* @flow */
import * as t from '@babel/types';

import typeAnnotationIterator from './typeAnnotationIterator';
import type ConversionContext from './ConversionContext';
import convert from './convert';
import loadFlowConfig from './loadFlowConfig';

import getTypeParameters from './getTypeParameters';
import {ok as invariant} from 'assert';
import type {Node, NodePath} from '@babel/traverse';

const flowConfig = loadFlowConfig();

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
    ImportDeclaration: {
      enter (path: NodePath) {
        if (context.shouldSuppressPath(path)) {
          path.skip();
          return;
        }

        const isImportType = path.node.importKind === 'type';
        const declarations = [];

        for (const specifier of path.get('specifiers')) {
          if (!isImportType && specifier.node.importKind !== 'type') {
            continue;
          }
          const local = specifier.get('local');
          const {name} = local.node;
          const replacement = path.scope.generateUidIdentifier(name);
          local.node.name = replacement.name;
          declarations.push(t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(name),
              context.call('tdz', t.arrowFunctionExpression(
                [],
                replacement
              ))
            )
          ]));
        }
        if (declarations.length !== 0) {
          let target = context.lastImportDeclaration || path;

          for (let i = declarations.length - 1; i >= 0; i--) {
            target.insertAfter(declarations[i]);
          }
        }
      },
      exit (path: NodePath) {
        if (path.node.importKind !== 'type') {
          let remapModule = false;
          for (const specifier of path.get('specifiers')) {
            if (specifier.node.importKind === 'type') {
              specifier.node.importKind = null;
              remapModule = true;
            }
          }
          if (remapModule) {
            if (flowConfig) {
              const importPath = flowConfig.remapModule(path.node.source.value);
              path.node.source.value = importPath;
            }
          }
          return;
        }
        path.node.importKind = 'value';
        if (flowConfig) {
          const importPath = flowConfig.remapModule(path.node.source.value);
          path.node.source.value = importPath;
        }
      }
    },
    ExportDeclaration: {
      enter (path: NodePath) {
        if (context.shouldSuppressPath(path)) {
          path.skip();
          return;
        }
      },
      exit (path: NodePath) {
        if (path.node.exportKind !== 'type') {
          return;
        }
        path.node.exportKind = 'value';
      }
    },
    TypeAlias (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const replacement = convert(context, path);
      context.replacePath(path, replacement);
    },
    TypeCastExpression (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const expression = path.get('expression');
      const typeAnnotation = path.get('typeAnnotation');
      if (shouldCheck && !expression.isIdentifier()) {
        context.replacePath(path, context.assert(
          convert(context, typeAnnotation),
          expression.node
        ));
        return;
      }
      const name = expression.node.name;
      const binding = path.scope.getBinding(name);
      if (binding) {
        if (binding.path.isCatchClause()) {
          // special case typecasts for error handlers.
          context.replacePath(path.parentPath, t.ifStatement(
            t.unaryExpression('!', t.callExpression(
              t.memberExpression(
                convert(context, typeAnnotation),
                t.identifier('accepts')
              ),
              [expression.node]
            )),
            t.blockStatement([t.throwStatement(expression.node)])
          ));
          return;
        }
        else if (name === 'reify') {
          if (typeAnnotation.isTypeAnnotation()) {
            const annotation = typeAnnotation.get('typeAnnotation');
            const isTypeWrapper = (
              annotation.isGenericTypeAnnotation() &&
              annotation.node.id.name === 'Type' &&
              annotation.node.typeParameters &&
              annotation.node.typeParameters.params &&
              annotation.node.typeParameters.params.length === 1
            );
            if (isTypeWrapper) {
              context.replacePath(path,
                convert(
                  context,
                  annotation.get('typeParameters.params')[0]
                )
              );
              return;
            }
          }
          context.replacePath(path,
            convert(context, typeAnnotation)
          );
          return;
        }
      }

      if (!path.parentPath.isExpressionStatement()) {
        if (!shouldCheck) {
          return;
        }
        // this typecast is part of a larger expression, just replace the value inline.
        context.replacePath(path, context.assert(
          convert(context, typeAnnotation),
          expression.node
        ));
        return;
      }

      let valueUid = path.scope.getData(`valueUid:${name}`);
      if (!valueUid) {
        valueUid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueUid:${name}`, valueUid);
        path.getStatementParent().insertBefore(t.variableDeclaration('let', [
          t.variableDeclarator(
            valueUid,
            convert(context, typeAnnotation)
          )
        ]));
      }
      else {
        path.getStatementParent().insertBefore(t.expressionStatement(
          t.assignmentExpression(
            '=',
            valueUid,
            convert(context, typeAnnotation)
          )
        ));
      }
      if (shouldCheck) {
        context.replacePath(path, context.assert(valueUid, expression.node));
      }
      else {
        context.replacePath(path, expression.node);
      }
    },
    VariableDeclarator (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const id = path.get('id');
      if (!id.has('typeAnnotation')) {
        return;
      }
      if (!id.isIdentifier()) {
        invariant(id.isArrayPattern() || id.isObjectPattern());
        const init = path.get('init');
        let wrapped = init.node;
        if (shouldCheck) {
          wrapped = context.assert(
            convert(context, id.get('typeAnnotation')),
            wrapped
          );
        }
        if (wrapped !== init.node) {
          context.replacePath(init, wrapped);
        }
        return;
      }
      const {name} = id.node;

      if (!path.has('init') || path.parentPath.node.kind !== 'const') {
        const valueUid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueUid:${name}`, valueUid);

        const isInForInOrOf = (
             path.parentPath.key === 'left'
          && path.parentPath.parentPath
          && (
               path.parentPath.parentPath.isForOfStatement()
            || path.parentPath.parentPath.isForAwaitStatement()
            || path.parentPath.parentPath.isForInStatement()
          )
        );

        if (isInForInOrOf) {
          // we can't insert a check directly, hoist it upwards.
          path.parentPath.parentPath.insertBefore(t.variableDeclaration('let', [
            t.variableDeclarator(
              valueUid,
              convert(context, id.get('typeAnnotation'))
            )
          ]));
        }
        else {
          path.insertBefore(t.variableDeclarator(
            valueUid,
            convert(context, id.get('typeAnnotation'))
          ));
        }

        if (shouldCheck && path.has('init')) {
          const wrapped = context.assert(
            valueUid,
            path.get('init').node
          );

          path.scope.removeOwnBinding(name);
          context.replacePath(path, t.variableDeclarator(
            t.identifier(name),
            wrapped
          ));
        }
      }
      else if (shouldCheck) {
        const wrapped = context.assert(
          convert(context, id.get('typeAnnotation')),
          path.get('init').node
        );

        path.scope.removeOwnBinding(name);
        context.replacePath(path, t.variableDeclarator(
          t.identifier(name),
          wrapped
        ));
      }
    },
    AssignmentExpression (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const left = path.get('left');
      if (!shouldCheck || !left.isIdentifier()) {
        return;
      }
      const name = left.node.name;
      const valueUid = path.scope.getData(`valueUid:${name}`);
      if (!valueUid) {
        return;
      }
      const right = path.get('right');
      context.replacePath(right, context.assert(
        valueUid,
        right.node
      ));
    },
    Function (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      else if (context.visited.has(path.node)) {
        path.skip();
        return;
      }
      else if (!shouldCheck) {
        return;
      }
      context.visited.add(path.node);
      const body = path.get('body');
      const definitions = [];
      const invocations = [];
      const typeParameters = getTypeParameters(path);
      const params = path.get('params');

      for (const typeParameter of typeParameters) {
        const {name} = typeParameter.node;
        const args = [t.stringLiteral(name)];
        if (typeParameter.has('bound') && typeParameter.has('default')) {
          args.push(
            convert(context, typeParameter.get('bound')),
            convert(context, typeParameter.get('default'))
          );
        }
        else if (typeParameter.has('bound')) {
          args.push(
            convert(context, typeParameter.get('bound'))
          );
        }
        else if (typeParameter.has('default')) {
          args.push(
            t.identifier('undefined'), // make sure we don't confuse bound with default
            convert(context, typeParameter.get('default'))
          );
        }

        definitions.push(t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(name),
            context.call('typeParameter', ...args)
          )
        ]));
      }

      for (let param of params) {
        const argumentIndex = +param.key;
        let assignmentRight;
        if (param.isAssignmentPattern()) {
          assignmentRight = param.get('right');
          param = param.get('left');
        }

        if (!param.has('typeAnnotation')) {
          continue;
        }
        const typeAnnotation = param.get('typeAnnotation');

        if (param.isObjectPattern() || param.isArrayPattern()) {
          const args = [
            t.stringLiteral(`arguments[${argumentIndex}]`),
            convert(context, typeAnnotation)
          ];
          if (param.has('optional')) {
            args.push(t.booleanLiteral(true));
          }

          const ref = t.memberExpression(
            t.identifier('arguments'),
            t.NumericLiteral(argumentIndex),
            true
          );

          const expression = t.expressionStatement(
            context.assert(
              context.call('param', ...args),
              ref
            )
          );
          if (assignmentRight) {
            invocations.push(
              t.ifStatement(
                t.binaryExpression(
                  '!==',
                  ref,
                  t.identifier('undefined')
                ),
                t.blockStatement([expression])
              )
            );
          }
          else {
            invocations.push(expression);
          }
        }
        else {
          let name = param.node.name;
          let methodName = 'param';
          if (param.isRestElement()) {
            methodName = 'rest';
            name = param.node.argument.name;
          }
          else {
            invariant(param.isIdentifier(), 'Param must be an identifier');
          }
          const valueUid = body.scope.generateUidIdentifier(`${name}Type`);
          body.scope.setData(`valueUid:${name}`, valueUid);
          definitions.push(t.variableDeclaration('let', [
            t.variableDeclarator(
              valueUid,
              convert(context, typeAnnotation)
            )
          ]));
          const args = [t.stringLiteral(name), valueUid];
          if (param.has('optional')) {
            args.push(t.booleanLiteral(true));
          }
          invocations.push(t.expressionStatement(
            context.assert(
              context.call(methodName, ...args),
              t.identifier(name)
            )
          ));
        }
      }

      if (path.has('returnType')) {
        let returnType = path.get('returnType');
        if (returnType.type === 'TypeAnnotation') {
          returnType = returnType.get('typeAnnotation');
        }


        const extra = getFunctionInnerChecks(context, path, returnType);

        if (extra) {
          const [yieldCheck, returnCheck, nextCheck] = extra;

          if (path.node.generator) {
            definitions.push(t.variableDeclaration('const', [
              t.variableDeclarator(
                body.scope.getData(`yieldTypeUid`),
                yieldCheck || context.call('mixed')
              )
            ]));


            if (nextCheck) {
              definitions.push(t.variableDeclaration('const', [
                t.variableDeclarator(
                  body.scope.getData(`nextTypeUid`),
                  nextCheck
                )
              ]));
            }
          }

          if (returnCheck) {
            definitions.push(t.variableDeclaration('const', [
              t.variableDeclarator(
                body.scope.getData(`returnTypeUid`),
                context.call('return', returnCheck)
              )
            ]));
          }
        }
        else {
          const returnTypeUid = body.scope.generateUidIdentifier('returnType');
          body.scope.setData(`returnTypeUid`, returnTypeUid);
          const promised = getPromisedType(context, returnType);
          if (!path.node.async && promised) {
            returnTypeUid.__isPromise = true;
            definitions.push(t.variableDeclaration('const', [
              t.variableDeclarator(
                returnTypeUid,
                context.call('return', convert(context, promised))
              )
            ]));
          }
          else {
            definitions.push(t.variableDeclaration('const', [
              t.variableDeclarator(
                returnTypeUid,
                context.call('return', convert(context, returnType))
              )
            ]));

            // explicit check as last statement for implicit function returns
            // like in function test() : string { /*NOOP*/ }
            if (body.node.body
              // do not add if last statement is return one
              && (body.node.body.length === 0
                || !body.node.body[ body.node.body.length - 1].type === "ReturnStatement")
            ) {
              // we do not add arguments here
              // only "return;"
              // assertion will be added later by code below
              body.node.body.push( t.ReturnStatement() );
            }
          }
        }
      }
      if (definitions.length > 0 || invocations.length > 0) {
        body.unshiftContainer('body', definitions.concat(invocations));
      }
    },

    ReturnStatement (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const fn = path.scope.getFunctionParent().path;
      if (!shouldCheck || !fn.has('returnType')) {
        return;
      }
      const argument = path.get('argument');

      const returnTypeUid = path.scope.getData('returnTypeUid');
      if (returnTypeUid.__isPromise) {
        const arg = path.scope.generateUidIdentifier('arg');
        context.replacePath(argument, t.callExpression(
          t.memberExpression(argument.node, t.identifier('then')),
          [t.arrowFunctionExpression(
            [arg],
            context.assert(
              returnTypeUid,
              arg
            )
          )]
        ));
      }
      else {
        context.replacePath(argument, context.assert(
          returnTypeUid,
          ...(argument.node ? [argument.node] : [])
        ));
      }
    },

    YieldExpression (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      const fn = path.scope.getFunctionParent().path;
      if (!shouldCheck || !fn.has('returnType')) {
        return;
      }
      if (context.visited.has(path.node)) {
        return;
      }
      let returnType = fn.get('returnType');
      if (returnType.isTypeAnnotation()) {
        returnType = returnType.get('typeAnnotation');
      }
      if (!returnType.isGenericTypeAnnotation()) {
        return;
      }
      const yieldTypeUid = path.scope.getData('yieldTypeUid');
      const nextTypeUid = path.scope.getData('nextTypeUid');

      const argument = path.get('argument');
      let replacement;
      if (yieldTypeUid) {
        if (path.node.delegate) {
          replacement = t.yieldExpression(
            t.callExpression(
              context.call('wrapIterator', yieldTypeUid),
              argument.node ? [argument.node] : []
            ),
            true
          );
        }
        else {
          replacement = t.yieldExpression(
            context.assert(
              yieldTypeUid,
              ...(argument.node ? [argument.node] : [])
            )
          );
        }
        context.visited.add(replacement);
      }
      else {
        replacement = path.node;
      }

      if (nextTypeUid) {
        if (path.parentPath.isExpressionStatement()) {
          context.replacePath(path, replacement);
        }
        else {
          context.replacePath(path, context.assert(
            nextTypeUid,
            replacement
          ));
        }
      }
    },

    Class: { exit (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      else if (!shouldCheck) {
        return;
      }

      const body = path.get('body');

      const typeParametersSymbolUid = context.getClassData(path, 'typeParametersSymbolUid');

      if (typeParametersSymbolUid) {
        path.getStatementParent().insertBefore(
          t.variableDeclaration('const', [
            t.VariableDeclarator(
              t.identifier(typeParametersSymbolUid),
              t.callExpression(
                t.identifier('Symbol'),
                [t.stringLiteral(
                  `${context.getClassData(path, 'currentClassName')}TypeParameters`
                )]
              )
            )
          ])
        );

        const staticProp = t.classProperty(
          context.symbol('TypeParameters'),
          t.identifier(typeParametersSymbolUid),
          null,
          null,
          true
        );
        staticProp.computed = true;
        staticProp.static = true;
        body.unshiftContainer('body', staticProp);
      }

      const typeParameters = getTypeParameters(path);

      const hasTypeParameters = typeParameters.length > 0;

      const superTypeParameters
          = path.has('superTypeParameters')
          ? path.get('superTypeParameters.params')
          : []
          ;

      const hasSuperTypeParameters = superTypeParameters.length > 0;
      if (path.has('superClass') && isReactComponentClass(path.get('superClass'))) {
        const annotation = hasSuperTypeParameters
                         ? superTypeParameters[0]
                         : getClassPropertyAnnotation(path, 'props')
                         ;

        if (annotation) {
          const propTypes = t.classProperty(
            t.identifier('propTypes'),
            context.call('propTypes', convert(context, annotation))
          );
          propTypes.static = true;
          body.unshiftContainer('body', propTypes);
        }
      }

      const hasImplements = path.has('implements');

      if (!shouldCheck || (!hasTypeParameters && !hasSuperTypeParameters && !hasImplements)) {
        // Nothing to do here.
        return;
      }

      const [constructor] = body.get('body').filter(
        item => item.node.kind === 'constructor'
      );
      const typeParametersUid = hasTypeParameters
        ? t.identifier(context.getClassData(path, 'typeParametersUid'))
        : null;


      const thisTypeParameters = t.memberExpression(
        t.thisExpression(),
        t.identifier(typeParametersSymbolUid || '___NONE___'),
        true
      );

      const constructorBlock = constructor.get('body');


      if (path.has('superClass')) {

        const trailer = [];
        if (hasTypeParameters) {
          constructorBlock.unshiftContainer('body', t.variableDeclaration(
            'const',
            [t.variableDeclarator(
              typeParametersUid,
              t.objectExpression(typeParameters.map(typeParameter => {
                return t.objectProperty(
                  t.identifier(typeParameter.node.name),
                  convert(context, typeParameter)
                );
              }))
            )]
          ));

          trailer.push(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                thisTypeParameters,
                typeParametersUid
              )
            )
          );
        }

        if (hasSuperTypeParameters) {
          trailer.push(t.expressionStatement(
            context.call(
              'bindTypeParameters',
              t.thisExpression(),
              ...superTypeParameters.map(item => convert(context, item))
            )
          ));
        }

        if (hasImplements) {
          constructorBlock.pushContainer('body', path.get('implements').map(item => t.expressionStatement(
            context.assert(
              convert(context, item),
              t.thisExpression()
            )
          )));
        }
        getSuperStatement(constructorBlock).insertAfter(trailer);
      }
      else {
        if (hasImplements) {
          constructorBlock.pushContainer('body', path.get('implements').map(item => t.expressionStatement(context.assert(
              convert(context, item),
              t.thisExpression()
            ))));
        }
        if (hasTypeParameters) {
          constructorBlock.unshiftContainer('body', t.expressionStatement(
            t.assignmentExpression(
              '=',
              thisTypeParameters,
              t.objectExpression(typeParameters.map(typeParameter => {
                return t.objectProperty(
                  t.identifier(typeParameter.node.name),
                  convert(context, typeParameter)
                );
              }))
            )
          ));
        }
      }


      if (hasTypeParameters) {
        const staticMethods = body.get('body').filter(
          item => item.isClassMethod() && item.node.static
        );

        for (const method of staticMethods) {
          method.get('body').unshiftContainer('body', t.variableDeclaration('const', [
            t.variableDeclarator(
              typeParametersUid,
              t.objectExpression(typeParameters.map(typeParameter => {
                return t.objectProperty(
                  t.identifier(typeParameter.node.name),
                  convert(context, typeParameter)
                );
              }))
            )
          ]));
        }
      }
    }},

    ClassProperty (path: NodePath) {
      if (context.shouldSuppressPath(path)) {
        path.skip();
        return;
      }
      if (!shouldCheck || !path.has('typeAnnotation') || path.node.computed) {
        return;
      }
      const typeAnnotation = path.get('typeAnnotation');
      let decorator;
      if (annotationReferencesClassEntity(context, typeAnnotation)) {
        const args = [
          t.functionExpression(
            null,
            [],
            t.blockStatement([
              t.returnStatement(convert(context, typeAnnotation))
            ])
          )
        ];
        if (context.shouldWarn) {
          args.push(t.booleanLiteral(false));
        }
        decorator = t.decorator(context.call(
          'decorate',
          ...args
        ));
      }
      else if (context.shouldWarn) {
        decorator = t.decorator(
          context.call('decorate', convert(context, typeAnnotation), t.booleanLiteral(false))
        );
      }
      else {
        decorator = t.decorator(
          context.call('decorate', convert(context, typeAnnotation))
        );
      }
      if (!path.has('decorators')) {
        path.node.decorators = [];
      }
      path.unshiftContainer('decorators', decorator);
    }
  };
}

function isReactComponentClass (path: NodePath): boolean {
  if (path.isIdentifier()) {
    return path.node.name === path.scope.getData('reactComponentClass')
        || path.node.name === path.scope.getData('reactPureComponentClass')
        ;
  }
  else if (path.isMemberExpression() && !path.node.computed) {
    const object = path.get('object');
    const property = path.get('property');
    if (!object.isIdentifier() || object.node.name !== path.scope.getData('reactLib')) {
      return false;
    }
    return property.isIdentifier()
        && (
             property.node.name === 'Component'
          || property.node.name === 'PureComponent'
        )
        ;
  }
  else {
    return false;
  }
}

const supportedIterableNames = {
  Generator: true,
  Iterable: true,
  Iterator: true,
  AsyncGenerator: true,
  AsyncIterable: true,
  AsyncIterator: true,
};

function getPromisedType (context: ConversionContext, returnType: NodePath): ? NodePath {
  if (!returnType.isGenericTypeAnnotation()) {
    return;
  }
  const id = returnType.get('id');
  const name = id.node.name;
  if (name !== 'Promise') {
    return;
  }
  const returnTypeParameters = getTypeParameters(returnType);
  if (returnTypeParameters.length === 0) {
    return;
  }
  return returnTypeParameters[0];
}
/**
 * Gets the inner checks for a given return type.
 * This is used for async functions and generators.
 * Returns either null or an array of check nodes in the format: Y, R, N.
 */
function getFunctionInnerChecks (context: ConversionContext, path: NodePath, returnType: NodePath): ? Array<?Node> {
  if (!path.node.async && !path.node.generator) {
    return;
  }
  if (!returnType.isGenericTypeAnnotation()) {
    return;
  }
  const returnTypeParameters = getTypeParameters(returnType);
  const id = returnType.get('id');
  const name = id.node.name;
  if (returnTypeParameters.length === 0) {
    // We're in an async or generator function but we don't have any type parameters.
    // We have to treat this as mixed.
    return [
      null,
      context.call('mixed'),
      null,
    ];
  }

  if (path.node.generator) {
    if (supportedIterableNames[name]) {
      const extra = [];
      for (const param of returnTypeParameters) {
        extra.push(convert(context, param));
      }
      return extra;
    }
  }
  else if (path.node.async) {
    // Make the return type a union with the promise resolution type.
    return [
      null,
      context.call(
        'union',
        convert(context, returnTypeParameters[0]),
        convert(context, returnType)
      ),
      null
    ];
  }
}

function getClassPropertyAnnotation (path: NodePath, name: string): ? NodePath {
  for (const item of path.get('body.body')) {
    if (item.isClassProperty() && item.get('key').isIdentifier() && !item.node.computed && item.node.key.name === name) {
      return item.get('typeAnnotation');
    }
  }
}

function annotationReferencesClassEntity (context: ConversionContext, annotation: NodePath): boolean {
  for (const item of typeAnnotationIterator(annotation)) {
    if (item.type !== 'Identifier') {
      continue;
    }
    const entity = context.getEntity(item.node.name, annotation);
    if (entity && entity.isClassTypeParameter) {
      return true;
    }
    else if (entity && entity.isValue && !entity.isGlobal) {
      return true;
    }

  }
  return false;
}

function getSuperStatement (block: NodePath): NodePath {
  let found;
  block.traverse({
    Super (path: NodePath) {
      found = path.getStatementParent();
    }
  });
  invariant(found, "Constructor of sub class must contain super().");
  return found;
}
