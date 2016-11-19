/* @flow */

export const input = `
  type Demo = string;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.string());
`;