/* @flow */
import traverse from 'babel-traverse';
import * as t from 'babel-types';

import ConversionContext from './ConversionContext';
import convert from './convert';

import firstPassVisitors from './firstPassVisitors';
import getTypeParameters from './getTypeParameters';
import {ok as invariant} from 'assert';
import type {Node, NodePath} from 'babel-traverse';

export default function transform (input: Node): Node {
  const context = new ConversionContext();

  traverse(input, firstPassVisitors(context));

  traverse(input, {
    Program (path: NodePath) {
      attachImport(context, path);
    },
    TypeAlias (path: NodePath) {
      const replacement = convert(context, path);
      path.replaceWith(replacement);
    },
    TypeCastExpression (path: NodePath) {
      const expression = path.get('expression');
      const typeAnnotation = path.get('typeAnnotation');
      if (!expression.isIdentifier()) {
        path.replaceWith(t.callExpression(
          t.memberExpression(
            convert(context, typeAnnotation),
            t.identifier('assert')
          ),
          [expression.node]
        ));
        return;
      }
      const name = expression.node.name;
      const binding = path.scope.getBinding(name);
      if (binding && binding.path.isCatchClause()) {
        // special case typecasts for error handlers.
        path.parentPath.replaceWith(t.ifStatement(
          t.unaryExpression('!', t.callExpression(
            t.memberExpression(
              convert(context, typeAnnotation),
              t.identifier('match')
            ),
            [expression.node]
          )),
          t.blockStatement([t.throwStatement(expression.node)])
        ));
        return;
      }

      let valueUid = path.scope.getData(`valueUid:${name}`);

      if (!valueUid) {
        valueUid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueUid:${name}`, valueUid);
        path.insertBefore(t.variableDeclaration('let', [
          t.variableDeclarator(
            valueUid,
            convert(context, typeAnnotation)
          )
        ]));
      }
      else {
        path.insertBefore(t.expressionStatement(
          t.assignmentExpression(
            '=',
            valueUid,
            convert(context, typeAnnotation)
          )
        ));
      }
      path.replaceWith(t.callExpression(
        t.memberExpression(
          valueUid,
          t.identifier('assert')
        ),
        [expression.node]
      ));
    },
    VariableDeclarator (path: NodePath) {
      const id = path.get('id');
      const {name} = id.node;

      if (!id.has('typeAnnotation')) {
        return;
      }
      if (!path.has('init') || path.parentPath.node.kind !== 'const') {
        const valueUid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueUid:${name}`, valueUid);
        path.insertBefore(t.variableDeclarator(
          valueUid,
          convert(context, id.get('typeAnnotation'))
        ));
        if (path.has('init')) {
          const wrapped = t.callExpression(
            t.memberExpression(
              valueUid,
              t.identifier('assert')
            ),
            [path.get('init').node]
          );
          path.replaceWith(t.variableDeclarator(
            t.identifier(name),
            wrapped
          ));
        }
        else {
          path.replaceWith(t.variableDeclarator(
            t.identifier(name)
          ));
        }
      }
      else {
        const wrapped = t.callExpression(
          t.memberExpression(
            convert(context, id.get('typeAnnotation')),
            t.identifier('assert')
          ),
          [path.get('init').node]
        );
        path.replaceWith(t.variableDeclarator(
          t.identifier(name),
          wrapped
        ));
      }
    },
    AssignmentExpression (path: NodePath) {
      const left = path.get('left');
      if (!left.isIdentifier()) {
        return;
      }
      const name = left.node.name;
      const valueUid = path.scope.getData(`valueUid:${name}`);
      if (!valueUid) {
        return;
      }
      const right = path.get('right');
      right.replaceWith(t.callExpression(
        t.memberExpression(
          valueUid,
          t.identifier('assert')
        ),
        [right.node]
      ));
    },
    Function (path: NodePath) {
      const body = path.get('body');

      const definitions = [];
      const invocations = [];
      const typeParameters = getTypeParameters(path);
      const params = path.get('params');

      for (const typeParameter of typeParameters) {
        const {name} = typeParameter.node;
        const args = [t.stringLiteral(name)];
        if (typeParameter.has('bound')) {
          args.push(
            convert(context, typeParameter.get('bound'))
          );
        }
        definitions.push(t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(name),
            context.call('typeParameter', ...args)
          )
        ]));
      }

      let shouldShadow = false;

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
          shouldShadow = true;

          const args = [
            t.stringLiteral(`arguments[${argumentIndex}]`),
            convert(context, typeAnnotation)
          ];
          if (param.has('optional')) {
            args.push(t.booleanLiteral(true));
          }

          const ref = t.memberExpression(
            t.identifier('arguments'),
            t.numericLiteral(argumentIndex),
            true
          );

          const expression = t.expressionStatement(
            t.callExpression(
              t.memberExpression(context.call('param', ...args), t.identifier('assert')),
              [ref]
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
          else if (!param.isIdentifier()) {
            continue;
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
            t.callExpression(
              t.memberExpression(context.call(methodName, ...args), t.identifier('assert')),
              [t.identifier(name)]
            )
          ));
        }



      }

      if (path.has('returnType')) {
        const returnType = path.get('returnType');
        const returnTypeUid = body.scope.generateUidIdentifier('returnType');
        body.scope.setData(`returnTypeUid`, returnTypeUid);
        definitions.push(t.variableDeclaration('const', [
          t.variableDeclarator(
            returnTypeUid,
            context.call('return', convert(context, returnType))
          )
        ]));
      }
      if (shouldShadow && path.isArrowFunctionExpression()) {
        path.arrowFunctionToShadowed();
        path.get('body').unshiftContainer('body', definitions.concat(invocations));
      }
      else {

        body.unshiftContainer('body', definitions.concat(invocations));
      }

    },

    ReturnStatement (path: NodePath) {
      const fn = path.scope.getFunctionParent().path;
      if (!fn.has('returnType')) {
        return;
      }
      const returnTypeUid = path.scope.getData('returnTypeUid');

      const argument = path.get('argument');
      argument.replaceWith(t.callExpression(
        t.memberExpression(returnTypeUid, t.identifier('assert')),
        argument.node ? [argument.node] : []
      ));
    },

    Class (path: NodePath) {
      const typeParameters = getTypeParameters(path);
      if (!typeParameters.length) {
        return;
      }

    },

    ClassProperty (path: NodePath) {
      if (!path.has('typeAnnotation')) {
        return;
      }
      const typeAnnotation = path.get('typeAnnotation');
      const decorator = t.decorator(context.call('decorateProperty', convert(context, typeAnnotation)));
      if (!path.has('decorators')) {
        path.node.decorators = [];
      }
      path.pushContainer('decorators', decorator);
    }
  });
  return input;
}

function attachImport (context: ConversionContext, container: NodePath) {
  for (const item of container.get('body')) {
    if (item.type === 'Directive') {
      continue;
    }
    const importDeclaration = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(context.libraryId))],
      t.stringLiteral(context.libraryName)
    );
    item.insertBefore(importDeclaration);
    return;
  }
}