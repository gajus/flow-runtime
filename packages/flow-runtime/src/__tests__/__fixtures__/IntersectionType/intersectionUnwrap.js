/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

  const Demo = t.type("Demo", t.intersection(
    t.object(
      t.property("key", t.string())
    ),
    t.object(
      t.property("value", t.number())
    )
  ));

  return Demo.unwrap().assert({
    key: "foo",
    value: 123
  });
}
