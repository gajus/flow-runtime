/* @flow */

export const input = `
  class Point {
    x: number = 0;
    y: number = 0;

    ["foo"]: boolean;
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    ["foo"];
  }
`;