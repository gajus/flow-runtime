/* @flow */

export const input = `
  type Demo = number;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.number());
`;

export const requireRuntime = `
  const t = require("flow-runtime");
  const Demo = t.type("Demo", t.number());
`;

