/* @flow */

import {
  TypeParameter
} from './types';

import type {
  Type,
  FunctionType,
  ParameterizedFunctionType,
  FunctionTypeParam,
  FunctionTypeRestParam
} from './types';

export function makeErrorMessage (expected: Type, input: any): string {
  const {context} = expected;
  const inferred = context.infer(input);
  return `Invalid ${expected.typeName}\n${printComparison(expected, inferred)}`;
}

export function makeParamErrorMessage (param: FunctionTypeParam | FunctionTypeRestParam, input: any): string {
  const {name, type, context} = param;
  const inferred = context.infer(input);

  return `Invalid value for parameter "${name}".\n${printComparison(type, inferred)}`;
}

export function makeReturnErrorMessage (fn: FunctionType | ParameterizedFunctionType<*>, input: any): string {
  const {context, returnType} = fn;
  const inferred = context.infer(input);

  return `Invalid return value for function.\n${printComparison(returnType, inferred)}`;

}

export function makeYieldErrorMessage () {

}

export function printComparison (expected: Type, actual: Type): string {
  if (expected instanceof TypeParameter) {
    expected = expected.recorded || expected.bound || expected;
  }
  return `Expected: ${expected.toString()}\n\nActual: ${actual.toString()}\n\n`;
}