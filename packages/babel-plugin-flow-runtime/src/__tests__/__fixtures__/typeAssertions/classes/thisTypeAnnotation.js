/* @flow */

export const input = `
  class A {
    b(): this {
      return this;
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  class A {
    b() {
      const _returnType = t.return(t.this(this));
      return _returnType.assert(this);
    }
  }
`;


export const annotated = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "A",
    t.method("b", t.return(t.this()))
  ))
  class A {
    b() {
      return this;
    }
  }
`;

export const combined = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "A",
    t.method("b", t.return(t.this()))
  ))
  class A {
    b() {
      const _returnType = t.return(t.this(this));
      return _returnType.assert(this);
    }
  }
`;