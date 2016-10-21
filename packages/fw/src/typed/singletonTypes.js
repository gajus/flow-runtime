/* @flow */

/**
 * This file exports a dictionary of global types that are shared by all contexts.
 * It is populated in [registerSingletonTypes()](./registerSingletonTypes.js).
 */

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


/**
 * Covers our builtin types and makes room for future ones.
 */
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

/**
 * Returns an object which will contain our types.
 * Tricks flow into propogating the correct type for the export
 * despite it not being populated yet.
 */
function makeDict (): SingletonTypes {
  return ({}: any);
}

const singletonTypes: SingletonTypes = makeDict();

export default singletonTypes;