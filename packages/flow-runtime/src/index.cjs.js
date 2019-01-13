/* @flow */

import globalContext from './globalContext';

import {
  Type,
  TypeParameter,
  TypeBox,
  TypeReference,
  TypeTDZ,
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
  ParameterizedClassDeclaration,
  ExtendsDeclaration
} from './declarations';

import TypeContext from './TypeContext';

function v (thing) {
  return { value: thing };
}

if (typeof global !== 'undefined' && global.__FLOW_RUNTIME_GLOBAL_CONTEXT_DO_NOT_USE_THIS_VARIABLE__ !== globalContext) {
  Object.defineProperties(globalContext, {
    TypeContext: v(TypeContext),
    Type: v(Type),
    TypeBox: v(TypeBox),
    TypeParameter: v(TypeParameter),
    TypeReference: v(TypeReference),
    TypeTDZ: v(TypeTDZ),
    ParameterizedTypeAlias: v(ParameterizedTypeAlias),
    TypeAlias: v(TypeAlias),
    TypeConstructor: v(TypeConstructor),
    GenericType: v(GenericType),
    NullLiteralType: v(NullLiteralType),
    NumberType: v(NumberType),
    NumericLiteralType: v(NumericLiteralType),
    BooleanType: v(BooleanType),
    BooleanLiteralType: v(BooleanLiteralType),
    SymbolType: v(SymbolType),
    SymbolLiteralType: v(SymbolLiteralType),
    StringType: v(StringType),
    StringLiteralType: v(StringLiteralType),
    ArrayType: v(ArrayType),
    ObjectType: v(ObjectType),
    ObjectTypeCallProperty: v(ObjectTypeCallProperty),
    ObjectTypeIndexer: v(ObjectTypeIndexer),
    ObjectTypeProperty: v(ObjectTypeProperty),
    FunctionType: v(FunctionType),
    FunctionTypeParam: v(FunctionTypeParam),
    FunctionTypeRestParam: v(FunctionTypeRestParam),
    FunctionTypeReturn: v(FunctionTypeReturn),
    ParameterizedFunctionType: v(ParameterizedFunctionType),
    PartialType: v(PartialType),
    RefinementType: v(RefinementType),
    TypeParameterApplication: v(TypeParameterApplication),
    GeneratorType: v(GeneratorType),
    ExistentialType: v(ExistentialType),
    FlowIntoType: v(FlowIntoType),
    AnyType: v(AnyType),
    MixedType: v(MixedType),
    EmptyType: v(EmptyType),
    NullableType: v(NullableType),
    ThisType: v(ThisType),
    TupleType: v(TupleType),
    UnionType: v(UnionType),
    IntersectionType: v(IntersectionType),
    VoidType: v(VoidType),
    Declaration: v(Declaration),
    VarDeclaration: v(VarDeclaration),
    TypeDeclaration: v(TypeDeclaration),
    ModuleDeclaration: v(ModuleDeclaration),
    ModuleExportsDeclaration: v(ModuleExportsDeclaration),
    ClassDeclaration: v(ClassDeclaration),
    ParameterizedClassDeclaration: v(ParameterizedClassDeclaration),
    ExtendsDeclaration: v(ExtendsDeclaration),
  });
}

export default globalContext;
