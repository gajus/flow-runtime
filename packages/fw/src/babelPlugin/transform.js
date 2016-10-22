/* @flow */
import traverse from 'babel-traverse';
import * as t from 'babel-types';

import ConversionContext from './ConversionContext';
import convert from './convert';

import firstPassVisitors from './firstPassVisitors';

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
      if (!expression.isIdentifier()) {
        path.replaceWith(t.callExpression(
          t.memberExpression(
            convert(context, path.get('typeAnnotation')),
            t.identifier('assert')
          ),
          [expression.node]
        ));
        return;
      }
      const name = expression.node.name;
      let valueUid;
      const binding = path.scope.getBinding(name);
      if (binding && binding.path.isCatchClause()) {
        // special case typecasts for error handlers.
        path.parentPath.replaceWith(t.ifStatement(
          t.unaryExpression('!', t.callExpression(
            t.memberExpression(
              convert(context, path.get('typeAnnotation')),
              t.identifier('match')
            ),
            [expression.node]
          )),
          t.blockStatement([t.throwStatement(expression.node)])
        ));
        return;
      }

      valueUid = path.scope.getData(`valueuid:${name}`);

      if (!valueUid) {
        const uid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueuid:${name}`, uid.name);
        path.insertBefore(t.variableDeclaration('let', [
          t.variableDeclarator(
            uid,
            convert(context, path.get('typeAnnotation'))
          )
        ]));
        valueUid = uid.name;
      }
      path.replaceWith(t.callExpression(
        t.memberExpression(
          t.identifier(valueUid),
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
        const uid = path.scope.generateUidIdentifier(`${name}Type`);
        path.scope.setData(`valueuid:${name}`, uid.name);
        path.insertBefore(t.variableDeclarator(
          uid,
          convert(context, id.get('typeAnnotation'))
        ));
        if (path.has('init')) {
          const wrapped = t.callExpression(
            t.memberExpression(
              uid,
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
      const valueUid = path.scope.getData(`valueuid:${name}`);
      if (!valueUid) {
        return;
      }
      const right = path.get('right');
      right.replaceWith(t.callExpression(
        t.memberExpression(
          t.identifier(valueUid),
          t.identifier('assert')
        ),
        [right.node]
      ));
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