/* @flow */

export const input = `
  class Point {
    x: number = 0;
    y: number = 0;

    z (a: string = "123"): string {
      return a;
    }

  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    z(a = "123") {
      let _aType = t.string();
      const _returnType = t.return(t.string());
      t.param("a", _aType).assert(a);
      return _returnType.assert(a);
    }
  }
`;


export const annotated = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.property("y", t.number()),
    t.method("z",
      t.param("a", t.string()),
      t.return(t.string())
    )
  ))
  class Point {
    x = 0;
    y = 0;

    z(a = "123") {
      return a;
    }
  }
`;

export const combined = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Point",
    t.property("x", t.number()),
    t.property("y", t.number()),
    t.method("z",
      t.param("a", t.string()),
      t.return(t.string())
    )
  ))
  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    z(a = "123") {
      let _aType = t.string();
      const _returnType = t.return(t.string());
      t.param("a", _aType).assert(a);
      return _returnType.assert(a);
    }
  }
`;