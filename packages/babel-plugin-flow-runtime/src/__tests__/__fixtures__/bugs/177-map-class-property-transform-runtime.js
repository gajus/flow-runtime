// @flow

export const input = `
  class Foo {
    bar: Map<string, any> = new Map();
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Foo {
    @t.decorate(t.ref(Map, t.string(), t.any()))
    bar = new Map();
  }
`;
