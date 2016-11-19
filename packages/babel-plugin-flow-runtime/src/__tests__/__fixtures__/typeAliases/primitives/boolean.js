/* @flow */

export const input = `
  type Demo = boolean;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.boolean());
`;