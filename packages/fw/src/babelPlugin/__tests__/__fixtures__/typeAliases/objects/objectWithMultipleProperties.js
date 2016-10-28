/* @flow */

export const input = `
  type Demo = {
    foo: string;
    bar: number;
    baz: number | string;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.object(
    t.property("foo", t.string()),
    t.property("bar", t.number()),
    t.property("baz", t.union(t.number(), t.string()))
  ));
`;