/* @flow */

export const input = `
  type Demo = [number, string];
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.tuple(t.number(), t.string()));
`;