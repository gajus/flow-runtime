/* @flow */

export const input = `
  declare module Demo {
    declare var foo: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare("Demo", t.module(t => {
    t.declare("foo", t.string());
  }));
`;