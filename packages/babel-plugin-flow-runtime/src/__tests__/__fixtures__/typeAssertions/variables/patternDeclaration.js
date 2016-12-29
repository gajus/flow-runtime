/* @flow */

export const input = `
  const [hello, world]: [string, string] = ["hello", "world"];
`;

export const expected = `
  import t from "flow-runtime";
  const [hello, world] = t.tuple(t.string(), t.string()).assert(["hello", "world"]);
`;