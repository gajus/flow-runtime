/* @flow */

export const input = `
  type Demo = Map<number, string>;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.map(t.number(), t.string(), Map));
`;
