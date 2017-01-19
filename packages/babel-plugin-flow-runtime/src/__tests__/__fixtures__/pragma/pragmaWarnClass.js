/* @flow */

export const input = `
/* @flow */
/* @flow-runtime warn */

class A {
  x: boolean = false;
}
`;

export const expected = `
import t from "flow-runtime";
/* @flow */
/* @flow-runtime warn */

class A {
  @t.decorate(t.boolean(), false)
  x = false;
}
`;