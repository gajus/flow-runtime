/* @flow */

export const input = `
  declare type Demo = string;
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.type("Demo", t.string()));
`;