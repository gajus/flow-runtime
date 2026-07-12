/* @flow */

export const input = `
  class Foo {
    bar: Map<string, any> = new Map();

    getValue(name: string) {
      return this.bar.get(name);
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Foo {
    @t.decorate(t.ref(Map, t.string(), t.any()))
    bar = new Map();

    getValue(name) {
      let _nameType = t.string();
      t.param("name", _nameType).assert(name);
      return this.bar.get(name);
    }
  }
`;

export const annotated = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Foo",
    t.property("bar", t.ref("Map", t.string(), t.any())),
    t.method("getValue", t.param("name", t.string()))
  ))
  class Foo {
    bar = new Map();

    getValue(name) {
      return this.bar.get(name);
    }
  }
`;

export const combined = `
  import t from "flow-runtime";

  @t.annotate(t.class(
    "Foo",
    t.property("bar", t.ref("Map", t.string(), t.any())),
    t.method("getValue", t.param("name", t.string()))
  ))
  class Foo {
    @t.decorate(t.ref(Map, t.string(), t.any()))
    bar = new Map();

    getValue(name) {
      let _nameType = t.string();
      t.param("name", _nameType).assert(name);
      return this.bar.get(name);
    }
  }
`;
