/* @flow */

export const input = `
  type Demo = true;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.boolean(true));
`;