/* @flow */

import type {Type} from './types';

import makeComparison from './makeComparison';

export default function makeError (expected: Type<any>, actual: any): TypeError {
  const {context} = expected;
  const inferred = context.typeOf(actual);
  const message = `${expected.makeErrorMessage()}\n\n${makeComparison(expected, inferred)}`;

  const error = new TypeError(message);

  error.name = 'RuntimeTypeError';
  return error;
}
