/* @flow */

export const input = `
  declare function demo (): string;
`;

export const expected = `
  import t from "flow-runtime";

  t.declare("demo", t.function(t.return(t.string())));
`;