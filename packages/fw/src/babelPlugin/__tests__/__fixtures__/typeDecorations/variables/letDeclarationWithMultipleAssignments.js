/* @flow */

export const input = `
  let demo: string = "qux";
  demo = "foo bar";
  demo = "hello world";
`;

export const expected = `
  import t from "runtime-types";
  let _demoType = t.string(), demo = _demoType.assert("qux");
  demo = _demoType.assert("foo bar");
  demo = _demoType.assert("hello world");
`;