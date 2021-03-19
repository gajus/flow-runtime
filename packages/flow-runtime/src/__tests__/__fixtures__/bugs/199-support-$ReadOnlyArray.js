/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass(t: TypeContext) {
  const Demo = t.type('Demo', t.$readOnlyArray(t.number(123)));

  return Demo.assert([123]);
}

export function fail(t: TypeContext) {
  const Demo = t.type('Demo', t.$readOnlyArray(t.number(123)));

  const arr = Demo.assert([123]);
  arr.push(4);

  return arr;
}
