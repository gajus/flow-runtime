/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ErrorType = t.object(
    t.property('message', t.string()),
    t.staticProperty('captureStackTrace', t.function())
  );
  const err = new Error('ok');
  return ErrorType.assert(err);
}


export function fail (t: TypeContext) {
  const ErrorType = t.object(
    t.property('message', t.string()),
    t.staticProperty('captureStackTrace', t.function())
  );
  const err = {message: 'nope'};
  return ErrorType.assert(err);
}