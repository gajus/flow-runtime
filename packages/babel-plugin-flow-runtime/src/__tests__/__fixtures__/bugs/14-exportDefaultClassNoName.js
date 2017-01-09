/* @flow */

export const input = `
export default class {
  a: string
}
`;

export const expected = `
  import t from "flow-runtime";

  export default class {
    @t.decorate(t.string())
    a;
  }
`;