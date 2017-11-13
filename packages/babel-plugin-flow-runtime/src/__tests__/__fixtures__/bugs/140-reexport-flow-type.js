/* @flow */

export const input = `
  export type {Foo} from './c';
`;

export const expected = `
  import t from "flow-runtime";
  export {
    Foo
  } from './c';
`;