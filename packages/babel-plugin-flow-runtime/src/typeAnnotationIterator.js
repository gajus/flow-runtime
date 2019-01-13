/* @flow */

import type {NodePath} from '@babel/traverse';

const visitors = {
  ArrayTypeAnnotation: ["elementType"],
  ClassImplements: ["id", "typeParameters"],
  ClassProperty: ["key", "value", "typeAnnotation", "decorators"],
  ClassMethod: ["key", "typeParameters", "params", "returnType"],
  ObjectProperty: ["key", "value", "typeAnnotation", "decorators"],
  ObjectMethod: ["key", "typeParameters", "params", "returnType"],
  DeclareClass: ["id", "typeParameters", "extends", "body"],
  DeclareFunction: ["id"],
  DeclareInterface: ["id", "typeParameters", "extends", "body"],
  DeclareModule: ["id", "body"],
  DeclareModuleExports: ["typeAnnotation"],
  DeclareTypeAlias: ["id", "typeParameters", "right"],
  DeclareVariable: ["id"],
  FunctionTypeAnnotation: ["typeParameters", "params", "rest", "returnType"],
  FunctionTypeParam: ["name", "typeAnnotation"],
  GenericTypeAnnotation: ["id", "typeParameters"],
  InterfaceExtends: ["id", "typeParameters"],
  InterfaceDeclaration: ["id", "typeParameters", "extends", "body"],
  IntersectionTypeAnnotation: ["types"],
  NullableTypeAnnotation: ["typeAnnotation"],
  TupleTypeAnnotation: ["types"],
  TypeofTypeAnnotation: ["argument"],
  TypeAlias: ["id", "typeParameters", "right"],
  TypeAnnotation: ["typeAnnotation"],
  TypeCastExpression: ["expression", "typeAnnotation"],
  TypeParameter: ["bound"],
  TypeParameterDeclaration: ["params"],
  TypeParameterInstantiation: ["params"],
  ObjectTypeAnnotation: ["properties", "indexers", "callProperties"],
  ObjectTypeCallProperty: ["value"],
  ObjectTypeIndexer: ["id", "key", "value"],
  ObjectTypeProperty: ["key", "value"],
  QualifiedTypeIdentifier: ["id", "qualification"],
  UnionTypeAnnotation: ["types"],
  ArrowFunctionExpression: ["typeParameters", "params", "returnType"],
  FunctionExpression: ["typeParameters", "params", "returnType"],
  FunctionDeclaration: ["typeParameters", "params", "returnType"],
  Identifier: ["typeAnnotation"],
  RestElement: ["argument", "typeAnnotation"],
  ArrayPattern: ["typeAnnotation"],
  ObjectPattern: ["typeAnnotation"],
  AssignmentPattern: ["left"]
};

export default function *typeAnnotationIterator (path: NodePath): Generator<NodePath, void, void> {
  yield path;
  const visitor = visitors[path.type];
  if (visitor) {
    for (const key of visitor) {
      const value = path.get(key);
      if (value) {
        if (Array.isArray(value)) {
          for (const element of value) {
            yield* typeAnnotationIterator(element);
          }
        }
        else {
          yield* typeAnnotationIterator(value);
        }
      }
    }
  }
}
