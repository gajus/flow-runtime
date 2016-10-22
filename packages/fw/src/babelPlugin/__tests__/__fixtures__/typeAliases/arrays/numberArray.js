/* @flow */

export const input = `
  type Demo = number[];
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.array(t.number()));
`;