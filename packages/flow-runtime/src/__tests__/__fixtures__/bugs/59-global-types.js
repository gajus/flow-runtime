/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const BufferType = t.ref('Buffer');

  const buf = new Buffer(64);
  return BufferType.assert(buf);
}


export function fail (t: TypeContext) {
  const BufferType = t.ref('Buffer');

  const nope = ['not', 'a', 'buffer'];
  return BufferType.assert(nope);
}