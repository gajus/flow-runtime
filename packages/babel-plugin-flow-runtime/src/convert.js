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
  try {
    return converter(context, path);
  }
  catch (e) {
    throw new Error(e.stack);
  }
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
  while (subject && subject.isFlow()) {
    const typeParameters = getTypeParameters(subject);
    for (const typeParameter of typeParameters) {
      if (typeParameter.node.name === name) {
        return true;
      }
    }
    subject = subject.parentPath;
  }
  return false;
}

function parentIsStaticMethod (subject: NodePath): boolean {
  const fn = subject.findParent(item => item.isClassMethod());
  if (!fn) {
    return false;
  }
  return fn.node.static;
}

function parentIsClassConstructorWithSuper (subject: NodePath): boolean {
  const fn = subject.findParent(item => item.isClassMethod() && item.node.kind === 'constructor');
  if (!fn) {
    return false;
  }
  const classDefinition = fn.parentPath.parentPath;
  if (classDefinition.has('superClass')) {
    return true;
  }
  else {
    return parentIsClassConstructorWithSuper(classDefinition.parentPath);
  }
}

function qualifiedToMemberExpression (subject: Node): Node {
  if (subject.type === 'QualifiedTypeIdentifier') {
    return t.memberExpression(
      qualifiedToMemberExpression(subject.qualification),
      subject.id
    );
  }
  else {
    return subject;
  }
}

function annotationToValue (subject: Node): Node {
  switch (subject.type) {
    case 'NullableTypeAnnotation':
    case 'TypeAnnotation':
      return annotationToValue(subject.typeAnnotation);
    case 'GenericTypeAnnotation':
      return annotationToValue(subject.id);
    case 'QualifiedTypeIdentifier':
      return t.memberExpression(
        annotationToValue(subject.qualification),
        subject.id
      );
    case 'NullLiteralTypeAnnotation':
      return t.nullLiteral();
    case 'VoidTypeAnnotation':
      return t.identifier('undefined');
    case 'BooleanLiteralTypeAnnotation':
      return t.booleanLiteral(subject.value);
    case 'NumericLiteralTypeAnnotation':
      return t.numericLiteral(subject.value);
    case 'StringLiteralTypeAnnotation':
      return t.stringLiteral(subject.value);

    default:
      return subject;
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
    return context.call('declare', t.stringLiteral(id.node.name), convert(context, id.get('typeAnnotation')));
  }
  else {
    return context.call('declare', t.stringLiteral(id.node.name));
  }
};


converters.DeclareTypeAlias = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  const right = path.get('right');
  return context.call('declare', t.stringLiteral(id.node.name), convert(context, right));
};


converters.DeclareFunction = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  if (id.has('typeAnnotation')) {
    return context.call('declare', t.stringLiteral(id.node.name), convert(context, id.get('typeAnnotation')));
  }
  else {
    return context.call('declare', t.stringLiteral(id.node.name));
  }
};


converters.DeclareModule = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  return context.call(
    'declare',
    t.stringLiteral(id.node.name),
    context.call(
      'module',
      t.arrowFunctionExpression(
        [t.identifier(context.libraryId)],
        t.blockStatement(path.get('body.body').map(item => t.expressionStatement(convert(context, item))))
      )
    )
  );

};


converters.DeclareClass = (context: ConversionContext, path: NodePath): Node => {
  const id = path.get('id');
  const name = id.node.name;


  const typeParameters = getTypeParameters(path);
  if (typeParameters.length > 0) {
    const uid = path.scope.generateUidIdentifier(name);
    return context.call('declare', t.stringLiteral(name), context.call('class', t.stringLiteral(name), t.arrowFunctionExpression(
      [uid],
      t.blockStatement([
        t.variableDeclaration('const', typeParameters.map(typeParameter => t.variableDeclarator(
            t.identifier(typeParameter.node.name),
            t.callExpression(
              t.memberExpression(
                uid,
                t.identifier('typeParameter')
              ),
              typeParameter.node.bound
                ? [t.stringLiteral(typeParameter.node.name), convert(context, typeParameter.get('bound'))]
                : [t.stringLiteral(typeParameter.node.name)]
            )
          )
        )),
        t.returnStatement(convert(context, path.get('body')))
      ])
    )));
  }
  else {
    return context.call('declare', t.stringLiteral(name), context.call('class', t.stringLiteral(name), convert(context, path.get('body'))));
  }
};

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
    // This type alias references itself, we need to wrap it in an arrow
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

converters.TypeofTypeAnnotation = (context: ConversionContext, path: NodePath): Node => {
  return context.call('typeOf', annotationToValue(path.get('argument').node));
};

converters.TypeParameter = (context: ConversionContext, path: NodePath): Node => {
  if (path.has('bound')) {
    return context.call('typeParameter', t.stringLiteral(path.node.name), convert(context, path.get('bound')));
  }
  else {
    return context.call('typeParameter', t.stringLiteral(path.node.name));
  }
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

converters.AnyTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('any');
};

converters.MixedTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('mixed');
};

converters.ExistentialTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('existential');
};

converters.EmptyTypeAnnotation = (context: ConversionContext, {node}: NodePath): Node => {
  return context.call('empty');
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
  const id = path.get('id');
  let name;
  let subject;
  if (id.isQualifiedTypeIdentifier()) {
    subject = qualifiedToMemberExpression(id.node);
    const outer = getMemberExpressionObject(subject);
    name = outer.name;
  }
  else {
    name = id.node.name;
    subject = t.identifier(name);
  }
  const typeParameters = getTypeParameters(path).map(item => convert(context, item));
  const entity = context.getEntity(name, path);

  const isDirectlyReferenceable
        = annotationParentHasTypeParameter(path, name)
        || (entity && (entity.isTypeAlias || entity.isTypeParameter))
        ;

  if (isDirectlyReferenceable) {
    if (typeParameters.length > 0) {
      return context.call('ref', subject, ...typeParameters);
    }
    else {
      return subject;
    }
  }
  else if (!entity) {
    return context.call('ref', t.stringLiteral(name), ...typeParameters);
  }
  else if (entity.isClassTypeParameter) {
    let target;
    const typeParametersUid = path.scope.getData('typeParametersUid');
    if (typeParametersUid && parentIsStaticMethod(path)) {
      target = t.memberExpression(
        t.identifier(typeParametersUid),
        subject
      );
    }
    else if (typeParametersUid && parentIsClassConstructorWithSuper(path)) {
      target = t.memberExpression(
        t.identifier(typeParametersUid),
        subject
      );
    }
    else {
      target = t.memberExpression(
        t.memberExpression(
          t.thisExpression(),
          context.symbol('TypeParameters'),
          true
        ),
        subject
      );
    }

    if (typeParameters.length > 0) {
      return context.call('ref', target, ...typeParameters);
    }
    else {
      return target;
    }
  }
  else {
    if (name === 'Array') {
      return context.call('array', ...typeParameters);
    }
    return context.call('ref', subject, ...typeParameters);
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
  return context.call(path.node.exact ? 'exactObject' : 'object', ...body.map(item => convert(context, item)));
};

converters.ObjectTypeCallProperty = (context: ConversionContext, path: NodePath): Node => {
  return context.call('callProperty', convert(context, path.get('value')));
};

converters.ObjectTypeProperty = (context: ConversionContext, path: NodePath): Node => {
  const propName = t.stringLiteral(path.node.key.name);
  const value = convert(context, path.get('value'));
  if (path.node.optional) {
    return context.call('property', propName, value, t.booleanLiteral(true));
  }
  else {
    return context.call('property', propName, value);
  }
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
