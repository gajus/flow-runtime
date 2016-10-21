/* @flow */

import {TypeParameter} from './types';

import type {Type} from './types';

export default function makeError (expected: Type, actual: any): TypeError {
  const {context} = expected;
  const inferred = context.infer(actual);
  const message = `${expected.makeErrorMessage()}\n\n${printComparison(expected, inferred)}`;

  const error = new TypeError(message);
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(error, makeError);
  }
  error.name = 'RuntimeTypeError';
  return error;
}

export function printComparison (expected: Type, inferred: Type): string {
  if (expected instanceof TypeParameter) {
    expected = expected.recorded || expected.bound || expected;
  }
  return `Expected: ${expected.toString()}\n\nActual: ${inferred.toString()}\n\n`;
}