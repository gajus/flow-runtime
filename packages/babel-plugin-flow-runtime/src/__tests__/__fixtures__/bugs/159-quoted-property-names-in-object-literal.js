/* @flow */

export const input = `
  type A = {"a": string, "b": string};
`;

export const expected = `
  import t from "flow-runtime";
  const A = t.type("A", t.object(t.property("a", t.string()), t.property("b", t.string())));
`;
