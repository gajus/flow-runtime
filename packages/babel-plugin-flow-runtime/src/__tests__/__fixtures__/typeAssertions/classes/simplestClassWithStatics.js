/* @flow */

export const input = `
  class Point {
    x: number = 0;
    static y: number = 0;
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    static y = 0;
  }
`;


export const annotated = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.staticProperty("y", t.number())
  ))
  class Point {
    x = 0;
    static y = 0;
  }
`;

export const combined = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.staticProperty("y", t.number())
  ))
  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    static y = 0;
  }
`;