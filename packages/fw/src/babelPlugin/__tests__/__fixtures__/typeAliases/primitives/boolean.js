/* @flow */

export const input = `
  type Demo = boolean;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.boolean());
`;