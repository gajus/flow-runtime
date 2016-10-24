/* @flow */

export const input = `
  const a = {
    b: 123
  };
  (a.b: number);
`;

export const expected = `
  import t from "runtime-types";
  const a = {
    b: 123
  };
  t.number().assert(a.b);
`;