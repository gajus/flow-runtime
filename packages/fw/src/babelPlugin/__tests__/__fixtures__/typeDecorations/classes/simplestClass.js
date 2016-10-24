/* @flow */

export const input = `
  class Point {
    x: number = 0;
    y: number = 0;
  }
`;

export const expected = `
  import t from "runtime-types";

  class Point {
    @t.decorateProperty(t.number())
    x = 0;
    @t.decorateProperty(t.number())
    y = 0;
  }
`;