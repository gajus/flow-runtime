/* @flow */

export const input = `
  type Demo = string;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.string());
`;