/* @flow */


import type {
  Type,
  NullLiteralType,
  NumberType,
  BooleanType,
  SymbolType,
  StringType,
  ExistentialType,
  AnyType,
  MixedType,
  EmptyType,
  VoidType
} from './types';


type SingletonTypes = {
  null: NullLiteralType;
  empty: EmptyType;
  number: NumberType;
  boolean: BooleanType;
  string: StringType;
  symbol: SymbolType;
  any: AnyType;
  mixed: MixedType;
  void: VoidType;
  existential: ExistentialType;

  [name: string]: Type;
};

function makeSingletonTypes (): SingletonTypes {
  return ({}: any);
}

const singletonTypes: SingletonTypes = makeSingletonTypes();

export default singletonTypes;