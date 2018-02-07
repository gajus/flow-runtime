/* @flow */

export const input = `
  import types from "flow-runtime";
  type Demo = number;
`;

export const expected = `
  import types from "flow-runtime";
  const Demo = types.type("Demo", types.number());
`;

export const customRuntime = `
  import types from "flow-runtime";
  const Demo = types.type("Demo", types.number());
`;
