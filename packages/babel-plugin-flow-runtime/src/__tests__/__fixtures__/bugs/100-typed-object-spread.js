/* @flow */

export const input = `
  type A = {a: number};
  type B = {b: string};

  type C = {...A, ...B};
`;

export const expected = `
  import t from "flow-runtime";
  const A = t.type("A", t.object(t.property("a", t.number())));
  const B = t.type("B", t.object(t.property("b", t.string())));
  const C = t.type("C", t.object(...A.properties, ...B.properties));
`;