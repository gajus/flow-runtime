/* @flow */

export const input = `
  declare var demo;
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.var("demo"));
`;