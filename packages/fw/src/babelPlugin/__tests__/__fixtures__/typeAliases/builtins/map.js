/* @flow */

export const input = `
  type Demo = Map<number, string>;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.ref(Map, t.number(), t.string()));
`;