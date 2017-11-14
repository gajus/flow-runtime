/* @flow */

export const input = `
  type A = Symbol;
`;

export const expected = `
  import t from "flow-runtime";
  const A = t.type("A", t.symbol());
`;
