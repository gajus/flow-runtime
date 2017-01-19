/* @flow */

import globalContext from './globalContext';

import {
  Type,
  TypeParameter,
  TypeBox,
  TypeReference,
  ParameterizedTypeAlias,
  TypeAlias,
  TypeConstructor,
  GenericType,
  NullLiteralType,
  NumberType,
  NumericLiteralType,
  BooleanType,
  BooleanLiteralType,
  SymbolType,
  SymbolLiteralType,
  StringType,
  StringLiteralType,
  ArrayType,
  ObjectType,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  FlowIntoType,
  FunctionType,
  ParameterizedFunctionType,
  PartialType,
  FunctionTypeParam,
  FunctionTypeRestParam,
  FunctionTypeReturn,
  GeneratorType,
  ExistentialType,
  AnyType,
  MixedType,
  EmptyType,
  NullableType,
  ThisType,
  TupleType,
  UnionType,
  IntersectionType,
  VoidType,
  RefinementType,
  TypeParameterApplication
} from './types';


import {
  Declaration,
  TypeDeclaration,
  VarDeclaration,
  ModuleDeclaration,
  ModuleExportsDeclaration,
  ClassDeclaration,
  ExtendsDeclaration
} from './declarations';

import {
  TypeParametersSymbol
} from './symbols';

import TypeContext from './TypeContext';

function defineProperty (name: string, value: any) {
  Object.defineProperty(globalContext, name, {
    value: value
  });
}

defineProperty('TypeParametersSymbol', TypeParametersSymbol);
defineProperty('TypeContext', TypeContext);
defineProperty('Type', Type);
defineProperty('TypeBox', TypeBox);
defineProperty('TypeParameter', TypeParameter);
defineProperty('TypeReference', TypeReference);
defineProperty('ParameterizedTypeAlias', ParameterizedTypeAlias);
defineProperty('TypeAlias', TypeAlias);
defineProperty('TypeConstructor', TypeConstructor);
defineProperty('GenericType', GenericType);
defineProperty('NullLiteralType', NullLiteralType);
defineProperty('NumberType', NumberType);
defineProperty('NumericLiteralType', NumericLiteralType);
defineProperty('BooleanType', BooleanType);
defineProperty('BooleanLiteralType', BooleanLiteralType);
defineProperty('SymbolType', SymbolType);
defineProperty('SymbolLiteralType', SymbolLiteralType);
defineProperty('StringType', StringType);
defineProperty('StringLiteralType', StringLiteralType);
defineProperty('ArrayType', ArrayType);
defineProperty('ObjectType', ObjectType);
defineProperty('ObjectTypeCallProperty', ObjectTypeCallProperty);
defineProperty('ObjectTypeIndexer', ObjectTypeIndexer);
defineProperty('ObjectTypeProperty', ObjectTypeProperty);
defineProperty('FunctionType', FunctionType);
defineProperty('FunctionTypeParam', FunctionTypeParam);
defineProperty('FunctionTypeRestParam', FunctionTypeRestParam);
defineProperty('FunctionTypeReturn', FunctionTypeReturn);
defineProperty('ParameterizedFunctionType', ParameterizedFunctionType);
defineProperty('PartialType', PartialType);
defineProperty('RefinementType', RefinementType);
defineProperty('TypeParameterApplication', TypeParameterApplication);
defineProperty('GeneratorType', GeneratorType);
defineProperty('ExistentialType', ExistentialType);
defineProperty('FlowIntoType', FlowIntoType);
defineProperty('AnyType', AnyType);
defineProperty('MixedType', MixedType);
defineProperty('EmptyType', EmptyType);
defineProperty('NullableType', NullableType);
defineProperty('ThisType', ThisType);
defineProperty('TupleType', TupleType);
defineProperty('UnionType', UnionType);
defineProperty('IntersectionType', IntersectionType);
defineProperty('VoidType', VoidType);
defineProperty('Declaration', Declaration);
defineProperty('VarDeclaration', VarDeclaration);
defineProperty('TypeDeclaration', TypeDeclaration);
defineProperty('ModuleDeclaration', ModuleDeclaration);
defineProperty('ModuleExportsDeclaration', ModuleExportsDeclaration);
defineProperty('ClassDeclaration', ClassDeclaration);
defineProperty('ExtendsDeclaration', ExtendsDeclaration);

export default globalContext;
