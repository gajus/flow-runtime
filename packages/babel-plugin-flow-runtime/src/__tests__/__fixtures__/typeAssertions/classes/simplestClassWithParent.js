/* @flow */

export const input = `
  class Parent {
    x: number = 0;
  }

  class Child extends Parent {
    y: number = 0;
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Parent {
    @t.decorate(t.number())
    x = 0;
  }

  class Child extends Parent {
    @t.decorate(t.number())
    y = 0;
  }
`;


export const annotated = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Parent",
    t.property("x", t.number())
  ))
  class Parent {
    x = 0;
  }

  @t.annotate(t.class(
    "Child",
    t.extends(Parent),
    t.property("y", t.number())
  ))
  class Child extends Parent {
    y = 0;
  }
`;

export const combined = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Parent",
    t.property("x", t.number())
  ))
  class Parent {
    @t.decorate(t.number())
    x = 0;
  }

  @t.annotate(t.class(
    "Child",
    t.extends(Parent),
    t.property("y", t.number())
  ))
  class Child extends Parent {
    @t.decorate(t.number())
    y = 0;
  }
`;