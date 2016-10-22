/* @flow */

export const input = `
  type Demo = "foo";
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.string("foo"));
`;