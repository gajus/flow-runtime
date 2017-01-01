/* @flow */

export const input = `
  declare module "Demo" {
    declare module.exports: any;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.module("Demo", t => {
    t.moduleExports(t.any());
  }));
`;