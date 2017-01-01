/* @flow */

export const input = `
  declare module "foo-bar" {
    declare var foo: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.module("foo-bar", t => {
    t.declare(t.var("foo", t.string()));
  }));
`;