/* @flow */

export const input = `
  type B = {a: A};
  type A = number;
`;

export const expected = `
  import t from "flow-runtime";
  const B = t.type("B", t.object(
    t.property("a", t.tdz(() => A, "A"))
  ));
  const A = t.type("A", t.number());
`;