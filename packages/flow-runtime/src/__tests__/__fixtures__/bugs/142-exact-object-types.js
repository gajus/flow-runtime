/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const A = t.type("A", t.exactObject(t.property("a", t.number()), t.property("b", t.number())));

  const val = { a: 5, b: 6 };

  return A.assert(val);
}


export function fail (t: TypeContext) {
 const A = t.type("A", t.exactObject(t.property("a", t.number()), t.property("b", t.number())));

 const val = { a: 5 };

 return A.assert(val);
}
