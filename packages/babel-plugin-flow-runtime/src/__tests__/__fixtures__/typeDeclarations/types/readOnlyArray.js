/* @flow */

export const input = `
  const a: $ReadOnlyArray<string> = [];
`;

export const expected = `
  import t from "flow-runtime";

  const a = t.$readOnlyArray(t.string()).assert([]);
`;
