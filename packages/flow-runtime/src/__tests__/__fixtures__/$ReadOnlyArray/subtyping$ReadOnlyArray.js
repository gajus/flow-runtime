/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass(t: TypeContext) {
  const bar = t.array(t.number()).assert([-1, 1, 2, 3]);
  const baz = t.$readOnlyArray(t.number()).assert(bar);
  return baz;
}

export function fail(t: TypeContext) {
  const bar = t.$readOnlyArray(t.number()).assert([0, 1, 2, 3]);
  const baz = t.array(t.number()).assert(bar);
  return baz;
}
