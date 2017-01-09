/* @flow */

import registerPrimitiveTypes from './registerPrimitiveTypes';
import registerBuiltinTypeConstructors from './registerBuiltins';
import registerTypePredicates from './registerTypePredicates';

import TypeContext from './TypeContext';

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
  FunctionType,
  ParameterizedFunctionType,
  FunctionTypeParam,
  FunctionTypeRestParam,
  FunctionTypeReturn,
  GeneratorType,
  ExistentialType,
  AnyType,
  MixedType,
  EmptyType,
  NullableType,
  TupleType,
  UnionType,
  IntersectionType,
  VoidType
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

const globalContext: any = new TypeContext();
registerPrimitiveTypes(globalContext);
registerBuiltinTypeConstructors(globalContext);
registerTypePredicates(globalContext);

globalContext.TypeContext = TypeContext;

globalContext.Type = Type;
globalContext.TypeBox = TypeBox;
globalContext.TypeParameter = TypeParameter;
globalContext.TypeReference = TypeReference;
globalContext.ParameterizedTypeAlias = ParameterizedTypeAlias;
globalContext.TypeAlias = TypeAlias;
globalContext.TypeConstructor = TypeConstructor;
globalContext.GenericType = GenericType;
globalContext.NullLiteralType = NullLiteralType;
globalContext.NumberType = NumberType;
globalContext.NumericLiteralType = NumericLiteralType;
globalContext.BooleanType = BooleanType;
globalContext.BooleanLiteralType = BooleanLiteralType;
globalContext.SymbolType = SymbolType;
globalContext.SymbolLiteralType = SymbolLiteralType;
globalContext.StringType = StringType;
globalContext.StringLiteralType = StringLiteralType;
globalContext.ArrayType = ArrayType;
globalContext.ObjectType = ObjectType;
globalContext.ObjectTypeCallProperty = ObjectTypeCallProperty;
globalContext.ObjectTypeIndexer = ObjectTypeIndexer;
globalContext.ObjectTypeProperty = ObjectTypeProperty;
globalContext.FunctionType = FunctionType;
globalContext.ParameterizedFunctionType = ParameterizedFunctionType;
globalContext.FunctionTypeParam = FunctionTypeParam;
globalContext.FunctionTypeRestParam = FunctionTypeRestParam;
globalContext.FunctionTypeReturn = FunctionTypeReturn;
globalContext.GeneratorType = GeneratorType;
globalContext.ExistentialType = ExistentialType;
globalContext.AnyType = AnyType;
globalContext.MixedType = MixedType;
globalContext.EmptyType = EmptyType;
globalContext.NullableType = NullableType;
globalContext.TupleType = TupleType;
globalContext.UnionType = UnionType;
globalContext.IntersectionType = IntersectionType;
globalContext.VoidType = VoidType;

globalContext.Declaration = Declaration;
globalContext.VarDeclaration = VarDeclaration;
globalContext.TypeDeclaration = TypeDeclaration;
globalContext.ModuleDeclaration = ModuleDeclaration;
globalContext.ModuleExportsDeclaration = ModuleExportsDeclaration;
globalContext.ClassDeclaration = ClassDeclaration;
globalContext.ExtendsDeclaration = ExtendsDeclaration;

export default (globalContext: TypeContext);