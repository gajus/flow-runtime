/* @flow */

import primitiveTypes from './primitiveTypes';

import type TypeContext from './TypeContext';

import {
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


export default function registerPrimitiveTypes (t: TypeContext): TypeContext {
  primitiveTypes.null = Object.freeze(new NullLiteralType(t));
  primitiveTypes.empty = Object.freeze(new EmptyType(t));
  primitiveTypes.number = Object.freeze(new NumberType(t));
  primitiveTypes.boolean = Object.freeze(new BooleanType(t));
  primitiveTypes.string = Object.freeze(new StringType(t));
  primitiveTypes.symbol = Object.freeze(new SymbolType(t));
  primitiveTypes.any = Object.freeze(new AnyType(t));
  primitiveTypes.mixed = Object.freeze(new MixedType(t));
  primitiveTypes.void = Object.freeze(new VoidType(t));
  primitiveTypes.existential = Object.freeze(new ExistentialType(t));
  return t;
}