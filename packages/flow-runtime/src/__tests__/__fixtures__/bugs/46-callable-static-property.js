/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ErrorType = t.object(
    t.staticCallProperty(t.function(t.param('message', t.string(), true))),
    t.property('message', t.string()),
    t.staticProperty('captureStackTrace', t.function())
  );
  const ABC = t.number(123);
  const DEF = t.number();
  DEF.assert(12345);
  ABC.assert(456);
  ABC.assert(false);
  ErrorType.assert('nope');
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