/* @flow */

export const input = `
  let demo: string = "hello world";
`;

export const expected = `
  import t from "flow-runtime";
  let _demoType = t.string(), demo = _demoType.assert("hello world");
`;