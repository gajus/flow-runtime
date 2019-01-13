/* @flow */

export type TypeCreator <T> = (partial: PartialType<T>) => T;
export type TypeRevealer <T> = () => ? Type<T> | Class<T>;

export type FunctionBodyCreator <X, P, R> = (
  partial: PartialType<(...params: P[]) => R>
) => Array<ValidFunctionBody<X, P, R>>;

export type ValidFunctionBody<X, P, R>
 = TypeParameter<X>
 | FunctionTypeParam<X | P>
 | FunctionTypeRestParam<X | P>
 | FunctionTypeReturn<R>
 ;

export type ObjectPropertyDict<T> = $ObjMap<T, <V>(v: Type<V>) => V>;

export type ValidObjectBody<O: {}>
 = ObjectTypeCallProperty<any>
 | ObjectTypeProperty<$Keys<O>, $ObjMap<O, <V>(v: Type<V>) => V>>
 | ObjectTypeIndexer<*, *>
 ;

export type TypeConstraint = (input: any) => ? string;

export type ApplicableType<T> = Type<T> & {
  name: string;
  apply <P> (...typeParameters: Type<P>[]): TypeParameterApplication<P, T>;
};

export type Constructor<T> = Class<T>;

import AnyType from './AnyType';
import ArrayType from './ArrayType';
import BooleanLiteralType from './BooleanLiteralType';
import BooleanType from './BooleanType';
import EmptyType from './EmptyType';
import ExistentialType from './ExistentialType';
import FlowIntoType from './FlowIntoType';
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
import RefinementType from './RefinementType';
import StringLiteralType from './StringLiteralType';
import StringType from './StringType';
import SymbolLiteralType from './SymbolLiteralType';
import SymbolType from './SymbolType';
import ThisType from './ThisType';
import TupleType from './TupleType';
import Type from './Type';
import TypeBox from './TypeBox';
import TypeConstructor from './TypeConstructor';
import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';
import TypeReference from './TypeReference';
import TypeTDZ from './TypeTDZ';
import UnionType from './UnionType';
import VoidType from './VoidType';

export {
  AnyType,
  ArrayType,
  BooleanLiteralType,
  BooleanType,
  EmptyType,
  ExistentialType,
  FlowIntoType,
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
  RefinementType,
  StringLiteralType,
  StringType,
  SymbolLiteralType,
  SymbolType,
  ThisType,
  TupleType,
  Type,
  TypeBox,
  TypeConstructor,
  TypeParameter,
  TypeParameterApplication,
  TypeReference,
  TypeTDZ,
  UnionType,
  VoidType
};
