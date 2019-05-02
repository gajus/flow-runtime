/* @flow */
import * as t from '@babel/types';
import type {NodePath} from '@babel/traverse';
import type ConversionContext from './ConversionContext';


export default function preTransformVisitors (context: ConversionContext): Object {

  return {
    Function (path: NodePath) {
      // see if we have any annotated ObjectPatterns or ArrayPatterns
      // as arguments.
      foldComplexParamsIntoBody(path);
    }
  };
}

function removePatternBindings(path: NodePath) {
  if (path.isIdentifier()) {
    path.scope.removeBinding(path.node.name);
  } else if (path.isRestElement()) {
    removePatternBindings(path.get('argument'));
  } else if (path.isObjectProperty()) {
    removePatternBindings(path.get('value'));
  } else if (path.isObjectPattern()) {
    const properties = path.get('properties');
    for (let i = 0; i < properties.length; i++) {
      removePatternBindings(properties[i]);
    }
  } else if (path.isArrayPattern()) {
    const elements = path.get('elements');
    for (let i = 0; i < elements.length; i++) {
      removePatternBindings(elements[i]);
    }
  }
}

function foldComplexParamsIntoBody (path: NodePath) {
  let body = path.get('body');
  const params = path.get('params');
  const extra = [];
  let accumulating = false;
  for (let i = 0; i < params.length; i++) {
    const original = params[i];
    let param = original;
    let assignmentRight;
    if (param.isAssignmentPattern()) {
      assignmentRight = param.get('right');
      param = param.get('left');
    }
    if (!accumulating && !param.has('typeAnnotation')) {
      continue;
    }
    if (param.isObjectPattern() || param.isArrayPattern()) {
      if (body.type !== 'BlockStatement') {
        body.replaceWith(t.blockStatement([
          t.returnStatement(body.node)
        ]));
        body = path.get('body');
        path.node.expression = false;
      }
      removePatternBindings(param);
      const cloned = t.cloneDeep(param.node);
      const uid = body.scope.generateUidIdentifier(`arg${params[i].key}`);
      uid.__flowRuntime__wasParam = true;
      cloned.__flowRuntime__wasParam = true;
      param.node.__flowRuntime__wasParam = true;
      if (original.node.optional) {
        uid.optional = true;
      }
      if (accumulating && assignmentRight) {
        extra.push(t.ifStatement(
          t.binaryExpression(
            '===',
            uid,
            t.identifier('undefined')
          ),
          t.blockStatement([
            t.expressionStatement(t.assignmentExpression(
              '=',
              uid,
              assignmentRight.node
            ))
          ])
        ));
        extra.push(t.variableDeclaration('let', [t.variableDeclarator(cloned, uid)]));
        original.replaceWith(uid);
      }
      else {
        extra.push(t.variableDeclaration('let', [t.variableDeclarator(cloned, uid)]));
        param.replaceWith(uid);
      }
      accumulating = true;
    }
    else if (accumulating && assignmentRight && !isSimple(assignmentRight)) {
      extra.push(t.ifStatement(
        t.binaryExpression(
          '===',
          param.node,
          t.identifier('undefined')
        ),
        t.blockStatement([
          t.expressionStatement(t.assignmentExpression(
            '=',
            param.node,
            assignmentRight.node
          ))
        ])
      ));
      original.replaceWith(param.node);
    }
  }
  if (extra.length > 0) {
    body.unshiftContainer('body', extra);
  }
}

function isSimple (path: NodePath): boolean {
  switch (path.type) {
    case 'NullLiteral':
    case 'NumberLiteral':
    case 'StringLiteral':
    case 'BooleanLiteral':
    case 'RegExpLiteral':
    case 'ThisExpression':
      return true;
    case 'Identifier':
      return path.node.name === 'undefined';
    default:
      return false;
  }
}
