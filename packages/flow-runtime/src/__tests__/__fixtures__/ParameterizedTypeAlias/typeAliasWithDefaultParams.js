/* @flow */

import type TypeContext from '../../../TypeContext';

function makeType (t: TypeContext) {
  return t.type("Demo", Demo => {
    const T = Demo.typeParameter("T", undefined, t.number());
    return t.object(
      t.property("x", T)
    );
  });
}

export function pass (t: TypeContext) {
  const type = makeType(t);
  type.assert({x: 123});
  return type.toString(true);
}


export function fail (t: TypeContext) {
  return makeType(t).assert({x: 'nope nope nope'});
}