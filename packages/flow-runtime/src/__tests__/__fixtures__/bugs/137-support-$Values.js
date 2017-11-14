/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const V = t.type(
    "V",
    t.object(
      t.property("a", t.number(123)),
      t.property("b", t.boolean(true)),
      t.property("c", t.null())
    )
  );
  const C = t.type("C", t.$values(V));

  return C.assert(123);
}


export function fail (t: TypeContext) {
  const V = t.type("V", t.object(t.property("a", t.number(123)), t.property("b", t.boolean(true)), t.property("c", t.null())));
  const C = t.type("C", t.$values(V));

  C.assert('nope');
}