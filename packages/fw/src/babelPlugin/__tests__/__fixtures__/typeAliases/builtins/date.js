/* @flow */

export const input = `
  type Demo = Date;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.ref(Date));
`;