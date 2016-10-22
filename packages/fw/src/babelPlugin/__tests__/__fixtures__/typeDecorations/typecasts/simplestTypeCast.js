/* @flow */

export const input = `
 let a = 123;
 (a: number);
`;

export const expected = `
  import t from "runtime-types";
  let a = 123;
  let _aType = t.number();
  _aType.assert(a);
`;