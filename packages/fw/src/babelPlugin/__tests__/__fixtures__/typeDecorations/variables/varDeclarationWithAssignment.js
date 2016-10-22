/* @flow */

export const input = `
  var demo: string;
  demo = "foo bar";
`;

export const expected = `
  import t from "runtime-types";
  var _demoType = t.string(), demo;
  demo = _demoType.assert("foo bar");
`;