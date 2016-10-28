/* @flow */

export const input = `
  const demo: string = "hello world";
`;

export const expected = `
  import t from "flow-runtime";
  const demo = t.string().assert("hello world");
`;