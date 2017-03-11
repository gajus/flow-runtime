/* @flow */

export const input = `
  type B = A;
  type A = string;
`;

export const expected = `
  import t from "flow-runtime";
  const B = t.type("B", t.tdz(() => A, "A"));
  const A = t.type("A", t.string());
`;