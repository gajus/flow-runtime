/* @flow */

import type {Type} from './types';
import makeTypeError from './errorReporting/makeTypeError';

export default function makeError (expected: Type<any>, input: any): ? TypeError {
  const {context} = expected;
  const validation = context.validate(expected, input);
  return makeTypeError(validation);
}
