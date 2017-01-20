/* @flow */

export const input = `
  for (const prop: any of []) {
    (prop: any);
  }
`;

export const expected = `
  import t from "flow-runtime";
  let _propType = t.any();
  for (const prop of []) {
    _propType = t.any();
    _propType.assert(prop);
  }
`;