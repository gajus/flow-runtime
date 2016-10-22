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
function convert (context: ConversionContext, path: NodePath): Node {
  const converter = converters[path.type];
  if (!converter) {
    throw new Error(`Unsupported node type: ${path.type}`);
  }
  return converter(context, path);
}

function annotationReferencesId (annotation: NodePath, name: string): boolean {
  for (const item of typeAnnotationIterator(annotation)) {
    if (item.type === 'Identifier' && item.node.name === name) {
      return true;
    }
  }
  return false;
}

function annotationParentHasTypeParameter (annotation: NodePath, name: string): boolean {
  let subject = annotation.parentPath;
  while (subject && subject.isFlow() && !subject.isTypeAlias()) {
    const typeParameters = getTypeParameters(subject);
    if (typeParameters.length > 0) {
      for (const typeParameter of typeParameters) {
        if (typeParameter.node.name === name) {
          return true;
        }
      }
    }
    subject = subject.parentPath;
  }
  return false;
}

converters.TypeAlias = (context: ConversionContext, path: NodePath): Node => {
  const name = path.node.id.name;
  const typeParameters = getTypeParameters(path);
  let body = convert(context, path.get('right'));
  if (typeParameters.length > 0) {
    body = t.arrowFunctionExpression(
      [t.identifier(name)],
      t.blockStatement([
        t.variableDeclaration('const', typeParameters.map(typeParameter => t.variableDeclarator(
            t.identifier(typeParameter.node.name),
            t.callExpression(
              t.memberExpression(
                t.identifier(name),
                t.identifier('typeParameter')
              ),
              typeParameter.node.bound
                ? [t.stringLiteral(typeParameter.node.name), convert(context, typeParameter.get('bound'))]
                : [t.stringLiteral(typeParameter.node.name)]
            )
          )
        )),
        t.returnStatement(body)
      ])
    );
  }
  else if (annotationReferencesId(path.get('right'), path.node.id.name)) {
    body = t.arrowFunctionExpression(
      [t.identifier(name)],
      t.blockStatement([
        t.returnStatement(body)
      ])
    );
  }
  return t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(name),
      context.call(
        'type',
        t.stringLiteral(name),
        body
      )
    )
  ]);
};

converters.TypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  return convert(context, path.get('typeAnnotation'));
};

converters.NullableTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  return context.call('nullable', convert(context, path.get('typeAnnotation')));
};

converters.NullLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('null');
};

converters.NumberTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('number');
};

converters.NumericLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('number', t.numericLiteral(node.value));
};

converters.BooleanTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('boolean');
};

converters.BooleanLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('boolean', t.booleanLiteral(node.value));
};

converters.StringTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('string');
};

converters.StringLiteralTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('string', t.stringLiteral(node.value));
};

converters.VoidTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('void');
};

converters.UnionTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const types = path.get('types').map(item => convert(context, item));
  return context.call('union', ...types);
};

converters.IntersectionTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const types = path.get('types').map(item => convert(context, item));
  return context.call('intersection', ...types);
};

converters.GenericTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const {node, scope} = path;
  const {name} = node.id;
  const typeParameters = getTypeParameters(path).map(item => convert(context, item));
  if (annotationParentHasTypeParameter(path, name) || scope.getData(`typealias:${name}`) || scope.getData(`typeparam:${name}`)) {
    if (typeParameters.length > 0) {
      return context.call('ref', t.identifier(name), ...typeParameters);
    }
    else {
      return t.identifier(name);
    }
  }
  else if (scope.getData(`valuetype:${name}`) || global[name]) {
    if (name === 'Array') {
      return context.call('array', ...typeParameters);
    }
    return context.call('ref', t.identifier(name), ...typeParameters);
  }
  else {
    return context.call('ref', t.stringLiteral(name), ...typeParameters);
  }
};

converters.ArrayTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const elementType = convert(context, path.get('elementType'));
  return context.call('array', elementType);
};

converters.TupleTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const types = path.get('types').map(item => convert(context, item));
  return context.call('tuple', ...types);
};


converters.ObjectTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const body = [
    ...path.get('callProperties'),
    ...path.get('properties'),
    ...path.get('indexers')
  ];
  return context.call('object', ...body.map(item => convert(context, item)));
};

converters.ObjectTypeCallProperty = (context: ConversionContext, path: NodePath): Node => {
  return context.call('callProperty', convert(context, path.get('value')));
};

converters.ObjectTypeProperty = (context: ConversionContext, path: NodePath): Node => {
  return context.call('property', t.stringLiteral(path.node.key.name), convert(context, path.get('value')));
};

converters.ObjectTypeIndexer = (context: ConversionContext, path: NodePath): Node => {
  return context.call(
    'indexer',
    t.stringLiteral(path.node.id.name),
    convert(context, path.get('key')),
    convert(context, path.get('value'))
  );
};


converters.FunctionTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  const body = [
    ...path.get('params').map(item => convert(context, item))
  ];
  if (path.has('rest')) {
    body.push(convert(context, path.get('rest')));
  }
  if (path.has('returnType')) {
    body.push(context.call('return', convert(context, path.get('returnType'))));
  }
  const typeParameters = getTypeParameters(path);
  if (typeParameters.length > 0) {
    const name = path.scope.generateUid('fn');
    return context.call('function', t.arrowFunctionExpression(
      [t.identifier(name)],
      t.blockStatement([
        t.variableDeclaration('const', typeParameters.map(typeParameter => t.variableDeclarator(
            t.identifier(typeParameter.node.name),
            t.callExpression(
              t.memberExpression(
                t.identifier(name),
                t.identifier('typeParameter')
              ),
              typeParameter.node.bound
                ? [t.stringLiteral(typeParameter.node.name), convert(context, typeParameter.get('bound'))]
                : [t.stringLiteral(typeParameter.node.name)]
            )
          )
        )),
        t.returnStatement(t.arrayExpression(body))
      ])
    ));
  }
  else {
    return context.call('function', ...body);
  }
};


converters.FunctionTypeParam = (context: ConversionContext, path: NodePath): Node => {
  const {name: {name}, optional} = path.node;
  const args = [
    t.stringLiteral(name),
    convert(context, path.get('typeAnnotation'))
  ];
  if (optional) {
    args.push(t.booleanLiteral(true));
  }
  if (path.key === 'rest') {
    return context.call('rest', ...args);
  }
  else {
    return context.call('param', ...args);
  }
};


export default convert;
