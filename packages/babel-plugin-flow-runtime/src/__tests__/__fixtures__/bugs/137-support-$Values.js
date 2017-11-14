/* @flow */

export const input = `
type V = {
  a: 123,
  b: true,
  c: null
}

type C = $Values<V>;
`;

export const expected = `
  import t from "flow-runtime";
  const V = t.type("V", t.object(t.property("a", t.number(123)), t.property("b", t.boolean(true)), t.property("c", t.null())));
  const C = t.type("C", t.$values(V));
`;