/* @flow */

export const input = `
  interface IPoint<T> {
    x: T;
    y: T;
  }
  class Point implements IPoint<number> {
    x: number = 0;
    y: number = 0;

    constructor () {
      console.log('created point');
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  const IPoint = t.type("IPoint", IPoint => {
    const T = IPoint.typeParameter("T");
    return t.object(
      t.property("x", T),
      t.property("y", T)
    );
  });

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    constructor() {
      console.log('created point');
      t.ref(IPoint, t.number()).assert(this);
    }
  }
`;


export const annotated = `
  import t from "flow-runtime";

  const IPoint = t.type("IPoint", IPoint => {
    const T = IPoint.typeParameter("T");
    return t.object(
      t.property("x", T),
      t.property("y", T)
    );
  });

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.property("y", t.number())
  ))
  class Point {
    x = 0;
    y = 0;
    constructor() {
      console.log('created point');
    }
  }
`;

export const combined = `
  import t from "flow-runtime";

  const IPoint = t.type("IPoint", IPoint => {
    const T = IPoint.typeParameter("T");
    return t.object(
      t.property("x", T),
      t.property("y", T)
    );
  });

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.property("y", t.number())
  ))
  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    constructor() {
      console.log('created point');
      t.ref(IPoint, t.number()).assert(this);
    }
  }
`;