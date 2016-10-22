/* @flow */

export const input = `
  type Demo = number | string;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.union(t.number(), t.string()));
`;