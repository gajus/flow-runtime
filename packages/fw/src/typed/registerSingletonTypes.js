/* @flow */

import singletonTypes from './singletonTypes';

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


export default function registerSingletonTypes (t: TypeContext): TypeContext {
  singletonTypes.null = new NullLiteralType(t);
  singletonTypes.empty = new EmptyType(t);
  singletonTypes.number = new NumberType(t);
  singletonTypes.boolean = new BooleanType(t);
  singletonTypes.string = new StringType(t);
  singletonTypes.symbol = new SymbolType(t);
  singletonTypes.any = new AnyType(t);
  singletonTypes.mixed = new MixedType(t);
  singletonTypes.void = new VoidType(t);
  singletonTypes.existential = new ExistentialType(t);
  return t;
}