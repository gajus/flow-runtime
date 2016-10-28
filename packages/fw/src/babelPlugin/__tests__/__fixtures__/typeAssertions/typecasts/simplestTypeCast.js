/* @flow */

export const input = `
 let a = 123;
 (a: number);
`;

export const expected = `
  import t from "flow-runtime";
  let a = 123;
  let _aType = t.number();
  _aType.assert(a);
`;