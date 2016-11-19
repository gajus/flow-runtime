/* @flow */

export const input = `
  type Demo = 123;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.number(123));
`;