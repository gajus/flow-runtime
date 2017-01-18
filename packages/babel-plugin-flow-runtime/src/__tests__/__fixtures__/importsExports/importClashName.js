/* @flow */

export const input = `
  import t from "babel-types";
  type Demo = number;
`;

export const expected = `
  import t from "babel-types";
  import _t from "flow-runtime";
  const Demo = _t.type("Demo", _t.number());
`;