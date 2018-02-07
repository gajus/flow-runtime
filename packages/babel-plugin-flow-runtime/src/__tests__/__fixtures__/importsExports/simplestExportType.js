/* @flow */

export const input = `
  export type Demo = string;
`;

export const expected = `
  import t from "flow-runtime";
  export const Demo = t.type("Demo", t.string());
`;

export const customRuntime = `
  import t from "./custom-flow-runtime";
  export const Demo = t.type("Demo", t.string());
`;
