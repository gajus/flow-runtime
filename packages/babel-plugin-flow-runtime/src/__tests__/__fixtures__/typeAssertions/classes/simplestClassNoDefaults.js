/* @flow */

export const input = `
  class Point {
    x: number;
    y: number;
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x;

    @t.decorate(t.number())
    y;
  }
`;