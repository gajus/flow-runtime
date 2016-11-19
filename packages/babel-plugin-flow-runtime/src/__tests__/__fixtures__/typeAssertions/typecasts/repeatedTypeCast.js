/* @flow */

export const input = `
 let a = 123;
 (a: number);
 (a: any);
 a = "hello world";
 (a: string);
`;

export const expected = `
  import t from "flow-runtime";
  let a = 123;
  let _aType = t.number();
  _aType.assert(a);
  _aType = t.any();
  _aType.assert(a);
  a = _aType.assert("hello world");
  _aType = t.string();
  _aType.assert(a);
`;