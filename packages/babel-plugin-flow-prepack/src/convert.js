/* @flow */

import * as t from 'babel-types';

import getTypeParameters from './getTypeParameters';
import typeAnnotationIterator from './typeAnnotationIterator';

import type {Node, NodePath} from 'babel-traverse';

import type ConversionContext from './ConversionContext';

export type Converter = (context: ConversionContext, path: NodePath) => Node;
export type ConverterDict = {[name: string]: Converter};

const converters: ConverterDict = {};


/**
 * Convert a type definition to a typed method call.
 */
function convert (context: ConversionContext, path: ?NodePath): Node {
  if (!path) {
    return t.identifier('undefined');
  }
  const loc = path.node.loc;
  let converter = converters[path.type];
  if (!converter) {
    return t.identifier('undefined');
  }
  const result = converter(context, path);
  if (!result) {
    return t.identifier('undefined');
  }
  if (loc) {
    result.loc = loc;
  }
  return result;
}


function qualifiedToMemberExpression (context: ConversionContext, path: NodePath): Node {
  let current = path;
  const stack = [];
  while (current.type === 'QualifiedTypeIdentifier') {
    stack.unshift(current.node.id);
    current = current.get('qualification');
  }

  const first = current.node;
  const second = stack[0];

  // is this a type or a value?
  const entity = context.getEntity(first.name, path);
  let isType = false;
  let isDirectlyReferenceable = false;
  if (entity) {
    if (entity.isValue) {
      isDirectlyReferenceable = true;
    }
    else {
      isType = true;
      if (entity.isGlobal) {
        isDirectlyReferenceable = false;
      }
      else {
        isDirectlyReferenceable = true;
      }
    }
  }
  else {
    isType = true;
  }

  if (!isDirectlyReferenceable) {

    const args = [
      t.stringLiteral(first.name),
      t.stringLiteral(second.name),
    ];
    for (let i = 1; i < stack.length; i++) {
      args.push(t.stringLiteral(stack[i]));
    }

    return context.call('get', ...args);
  }
  else if (isType) {
    const args = [
      first,
      t.stringLiteral(second.name),
    ];
    for (let i = 1; i < stack.length; i++) {
      args.push(t.stringLiteral(stack[i]));
    }

    return context.call('get', ...args);
  }
  else {

    let inner = t.memberExpression(
      first,
      second
    );

    for (let i = 1; i < stack.length; i++) {
      inner = t.memberExpression(inner, stack[i]);
    }
    return inner;
  }
}

function annotationToValue (context: ConversionContext, subject: NodePath): Node {
  switch (subject.type) {
    case 'NullableTypeAnnotation':
    case 'TypeAnnotation':
      return annotationToValue(context, subject.get('typeAnnotation'));
    case 'GenericTypeAnnotation':
      return annotationToValue(context, subject.get('id'));
    case 'QualifiedTypeIdentifier':
      return qualifiedToMemberExpression(context, subject);
    case 'NullLiteralTypeAnnotation':
      return t.nullLiteral();
    case 'VoidTypeAnnotation':
      return t.identifier('undefined');
    case 'BooleanLiteralTypeAnnotation':
      return t.booleanLiteral(subject.node.value);
    case 'NumericLiteralTypeAnnotation':
      return t.numericLiteral(subject.node.value);
    case 'StringLiteralTypeAnnotation':
      return t.stringLiteral(subject.node.value);

    default:
      return subject.node;
  }
}

function getMemberExpressionObject (subject: Node): Node {
  if (subject.type === 'MemberExpression') {
    return getMemberExpressionObject(subject.object);
  }
  else {
    return subject;
  }
}

converters.DeclareVariable = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  if (id.has('typeAnnotation')) {
    return context.assumeGlobalDataProperty(
      id.node.name,
      convert(context, id.get('typeAnnotation'))
    );
  }
  else {
    return context.assumeGlobalDataProperty(
      id.node.name
    );
  }
};

converters.DeclareFunction = (context: ConversionContext, path: NodePath): Node => {
  return context.assumeGlobalDataProperty(id.node.name);
};

converters.InterfaceDeclaration = (context: ConversionContext, path: NodePath): Node => {
  const name = path.node.id.name;
  let body = convert(context, path.get('body'));

  if (path.has('extends')) {
    body = t.objectExpression([
      ...(
        path.get('extends')
        .map(item => convert(context, item))
        .filter(Boolean)
        .map(item => t.spreadProperty(item))
      ),
      t.spreadProperty(body)
    ]);
  }

  return t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(name),
      body
    )
  ]);
};

converters.InterfaceExtends = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  if (id.isQualifiedTypeIdentifier()) {
    return qualifiedToMemberExpression(context, id);
  }
  else {
    return t.identifier(id.node.name);
  }
};

converters.DeclareClass = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  const name = id.node.name;

  let body = convert(context, path.get('body'));

  if (path.has('extends')) {
    const parents = path.get('extends').map(item => t.spreadProperty(convert(context, item)));

    body = context.abstract(t.objectExpression(
      ...parents,
      t.spreadProperty(body)
    ));
  }
  else {
    body = context.abstract(body);
  }

  return context.assumeDataProperty(
    t.memberExpression(
      t.identifier('global'),
      t.identifier(name)
    ),
    'prototype',
    body
  );
};

converters.TypeAlias = (context: ConversionContext, path: NodePath): Node => {
  const name = path.node.id.name;
  const typeParameters = getTypeParameters(path);
  let body = convert(context, path.get('right'));
  return t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(name),
      body
    )
  ]);
};

converters.TypeofTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const value = annotationToValue(context, path.get('argument'));
  if (value.type === 'CallExpression') {
    // this is a reference to a type
    return value;
  }
  else {
    return context.abstract(t.unaryExpression('typeof', value));
  }
};

converters.TypeParameter = (context: ConversionContext, path: NodePath): Node => {
  // not supported for now.
  return t.identifier('undefined');
};

converters.TypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  return convert(context, path.get('typeAnnotation'));
};

converters.NullableTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  // not supported for now.
  return convert(context, path.get('typeAnnotation'));
};

converters.NumberTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('number');
};

converters.NumericLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('number');
};

// Duplicated for compatibility with flow-parser.
converters.NumberLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('number');
};

converters.BooleanTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('boolean');
};

converters.BooleanLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('boolean');
};

converters.StringTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('string');
};

converters.StringLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return t.stringLiteral('string');
};


converters.GenericTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  let name;
  let subject;
  if (id.isQualifiedTypeIdentifier()) {
    subject = qualifiedToMemberExpression(context, id);
    const outer = getMemberExpressionObject(subject);
    name = outer.name;
  }
  else {
    name = id.node.name;
    subject = t.identifier(name);
  }
  if (context.shouldSuppressTypeName(name)) {
    return;
  }
  if (context.inTDZ(id.node)) {
    return;
  }
  const typeParameters = getTypeParameters(path).map(item => convert(context, item));
  const entity = context.getEntity(name, path);

  if (!entity) {
    if (name === 'Object') {
      return t.stringLiteral('object');
    }
    return;
  }

  const isDirectlyReferenceable = entity && entity.isTypeAlias;

  if (isDirectlyReferenceable) {
    return subject;
  }
};

converters.ObjectTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {

  const body = path.get('properties').filter(property => !property.node.static);
  return t.objectExpression(body.map(item => convert(context, item)));
};


converters.ObjectTypeSpreadProperty = (context: ConversionContext, path: NodePath): Node => {
  const arg = convert(context, path.get('argument'));
  if (arg) {
    return t.spreadProperty(arg);
  }
};


converters.ObjectTypeProperty = (context: ConversionContext, path: NodePath): Node => {
  let propName;
  if (path.node.optional) {
    // not supported.
    return;
  }
  const value = context.abstract(convert(context, path.get('value')));
  return t.objectProperty(
    path.node.key,
    value
  );
};

export default convert;


