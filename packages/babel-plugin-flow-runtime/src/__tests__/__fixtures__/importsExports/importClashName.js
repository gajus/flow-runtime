/* @flow */

export const input = `
  import t from "babel-types";
  type Demo = number;
`;

export const expected = `
  import _t from "flow-runtime";
  import t from "babel-types";
  const Demo = _t.type("Demo", _t.number());
`;