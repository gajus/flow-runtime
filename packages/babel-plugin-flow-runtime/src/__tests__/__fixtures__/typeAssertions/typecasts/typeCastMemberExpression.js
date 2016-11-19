/* @flow */

export const input = `
  const a = {
    b: 123
  };
  (a.b: number);
`;

export const expected = `
  import t from "flow-runtime";
  const a = {
    b: 123
  };
  t.number().assert(a.b);
`;