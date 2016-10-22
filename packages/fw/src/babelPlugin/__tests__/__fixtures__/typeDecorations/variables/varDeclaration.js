/* @flow */

export const input = `
  var demo: string = "hello world";
`;

export const expected = `
  import t from "runtime-types";
  var _demoType = t.string(), demo = _demoType.assert("hello world");
`;