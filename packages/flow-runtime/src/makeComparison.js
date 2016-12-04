/* @flow */

import {
  TypeParameter,
  FunctionTypeParam,
  FunctionTypeReturn,
  FunctionTypeRestParam,
  TypeReference,
  PartialType,
  TypeAlias,
  NullableType,
  ObjectType,
  ObjectTypeIndexer,
  ObjectTypeCallProperty,
  ObjectTypeProperty,
} from './types';

import type {Type} from './types';

export default function makeComparison (expected: Type<any>, inferred: Type<any>): string {
  const resolved = resolveType(expected);
  if (resolved instanceof ObjectType && inferred instanceof ObjectType) {
    return makeObjectComparison(resolved, inferred);
  }
  else {
    return makeSimpleComparison(resolved, inferred);
  }
}

export function resolveType (input: Type<any>) {
  if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
    return resolveType(input.type);
  }
  else if (input instanceof FunctionTypeReturn) {
    return input.type;
  }
  else if (input instanceof TypeReference) {
    return resolveType(input.type);
  }
  else if (input instanceof PartialType) {
    return resolveType(input.type);
  }
  else if (input instanceof TypeParameter) {
    return resolveType(input.recorded || input.bound || input);
  }
  else if (input instanceof TypeAlias) {
    return resolveType(input.type);
  }
  else if (input instanceof ObjectTypeCallProperty) {
    return resolveType(input.value);
  }
  else if (input instanceof ObjectTypeIndexer) {
    return resolveType(input.value);
  }
  else if (input instanceof ObjectTypeProperty) {
    return resolveType(input.value);
  }
  else if (input instanceof NullableType) {
    return resolveType(input.type);
  }
  else {
    return input;
  }
}

export function makeSimpleComparison (expected: Type<any>, inferred: Type<any>): string {
  return `Expected: ${expected.toString()}\n\nActual: ${inferred.toString()}\n\n`;
}

export function makeObjectComparison (expected: ObjectType<Object>, inferred: ObjectType<Object>): string {
  for (const expectedProperty of expected.properties) {
    const inferredProperty = inferred.getProperty(expectedProperty.key);
    if (!inferredProperty) {

    }
  }
  return makeSimpleComparison(expected, inferred);
}