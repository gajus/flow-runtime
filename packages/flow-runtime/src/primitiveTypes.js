/* @flow */

/**
 * This file exports a dictionary of global primitive types that are shared by all contexts.
 * It is populated in [registerPrimitiveTypes()](./registerPrimitiveTypes.js).
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
type PrimitiveTypes = {
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

  [name: string]: Type<any>;
};

const primitiveTypes: any = {};

(primitiveTypes: PrimitiveTypes);

export default primitiveTypes;