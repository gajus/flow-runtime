/* @flow */

export const input = `
  export type Demo = number;
`;

export const expected = `
  import t from "flow-runtime";

  export const Demo = t.type("Demo", t.number());
`;