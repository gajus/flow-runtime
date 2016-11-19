/* @flow */

export const input = `
  let demo: string;
  demo = "foo bar";
`;

export const expected = `
  import t from "flow-runtime";
  let _demoType = t.string(), demo;
  demo = _demoType.assert("foo bar");
`;