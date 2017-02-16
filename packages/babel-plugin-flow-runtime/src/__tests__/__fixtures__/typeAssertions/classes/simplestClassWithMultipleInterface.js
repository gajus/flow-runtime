/* @flow */

export const input = `
  interface XPoint<T> {
    x: T;
  }
  interface YPoint<T> {
    y: T;
  }
  class Point implements XPoint<number>, YPoint<number> {
    x: number = 0;
    y: number = 0;
  }
`;

export const expected = `
  import t from "flow-runtime";

  const XPoint = t.type("XPoint", XPoint => {
    const T = XPoint.typeParameter("T");
    return t.object(
      t.property("x", T)
    );
  });

  const YPoint = t.type("YPoint", YPoint => {
    const T = YPoint.typeParameter("T");
    return t.object(
      t.property("y", T)
    );
  });

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    constructor() {
      t.ref(XPoint, t.number()).assert(this);
      t.ref(YPoint, t.number()).assert(this);
    }
  }
`;


export const annotated = `
  import t from "flow-runtime";

  const XPoint = t.type("XPoint", XPoint => {
    const T = XPoint.typeParameter("T");
    return t.object(
      t.property("x", T)
    );
  });

  const YPoint = t.type("YPoint", YPoint => {
    const T = YPoint.typeParameter("T");
    return t.object(
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
  }
`;

export const combined = `
  import t from "flow-runtime";

  const XPoint = t.type("XPoint", XPoint => {
    const T = XPoint.typeParameter("T");
    return t.object(
      t.property("x", T)
    );
  });

  const YPoint = t.type("YPoint", YPoint => {
    const T = YPoint.typeParameter("T");
    return t.object(
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
      t.ref(XPoint, t.number()).assert(this);
      t.ref(YPoint, t.number()).assert(this);
    }
  }
`;