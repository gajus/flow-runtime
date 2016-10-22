/* @flow */

import type {Type} from './types';

import makeComparison from './makeComparison';

export default function makeError (expected: Type, actual: any): TypeError {
  const {context} = expected;
  const inferred = context.infer(actual);
  const message = `${expected.makeErrorMessage()}\n\n${makeComparison(expected, inferred)}`;

  const error = new TypeError(message);
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(error, makeError);
  }
  error.name = 'RuntimeTypeError';
  return error;
}
