/* @flow */

export const input = `
  type Demo = $ReadOnlyArray<number>;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.array(t.number()));
`;
