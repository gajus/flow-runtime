/* @flow */

export type TypeCreator <T: Type> = (partial: PartialType<T>) => T;
export type FunctionBodyCreator <T: FunctionType> = (partial: PartialType<T>) => Array<FunctionTypeParam | FunctionTypeRestParam | FunctionTypeReturn>;

export type TypeConstraint = (input: any) => boolean;

export type IApplicableType = Type & {
  name: string;
  apply (...typeParameters: Type[]): TypeParameterApplication;
};

export type Constructor = Function;

import AnyType from './AnyType';
import ArrayType from './ArrayType';
import BooleanLiteralType from './BooleanLiteralType';
import BooleanType from './BooleanType';
import EmptyType from './EmptyType';
import ExistentialType from './ExistentialType';
import FunctionType from './FunctionType';
import FunctionTypeParam from './FunctionTypeParam';
import FunctionTypeRestParam from './FunctionTypeRestParam';
import FunctionTypeReturn from './FunctionTypeReturn';
import GeneratorType from './GeneratorType';
import GenericType from './GenericType';
import IntersectionType from './IntersectionType';
import MixedType from './MixedType';
import TypeAlias from './TypeAlias';
import NullableType from './NullableType';
import NullLiteralType from './NullLiteralType';
import NumberType from './NumberType';
import NumericLiteralType from './NumericLiteralType';
import ObjectType from './ObjectType';
import ObjectTypeCallProperty from './ObjectTypeCallProperty';
import ObjectTypeIndexer from './ObjectTypeIndexer';
import ObjectTypeProperty from './ObjectTypeProperty';
import ParameterizedTypeAlias from './ParameterizedTypeAlias';
import ParameterizedFunctionType from './ParameterizedFunctionType';
import PartialType from './PartialType';
import StringLiteralType from './StringLiteralType';
import StringType from './StringType';
import SymbolLiteralType from './SymbolLiteralType';
import SymbolType from './SymbolType';
import TupleType from './TupleType';
import Type from './Type';
import TypeHandler from './TypeHandler';
import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';
import TypeReference from './TypeReference';
import UnionType from './UnionType';
import VoidType from './VoidType';

export {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  EmptyType,
  ExistentialType,
  FunctionType,
  FunctionTypeParam,
  FunctionTypeRestParam,
  FunctionTypeReturn,
  GeneratorType,
  GenericType,
  IntersectionType,
  MixedType,
  TypeAlias,
  NullableType,
  NullLiteralType,
  NumberType,
  NumericLiteralType,
  ObjectType,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  ParameterizedTypeAlias,
  ParameterizedFunctionType,
  PartialType,
  StringLiteralType,
  StringType,
  SymbolLiteralType,
  SymbolType,
  TupleType,
  Type,
  TypeHandler,
  TypeParameter,
  TypeParameterApplication,
  TypeReference,
  UnionType,
  VoidType
};