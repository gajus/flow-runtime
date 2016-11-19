/* @flow */

export const input = `
  type Demo = {
    (foo: string): string;
    (bar: boolean): boolean;
    foo: string;
    bar: number;
    baz: number | string;
    [key: string]: number;
    [index: number]: boolean;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.object(
    t.callProperty(t.function(
      t.param("foo", t.string()),
      t.return(t.string())
    )),
    t.callProperty(t.function(
      t.param("bar", t.boolean()),
      t.return(t.boolean())
    )),
    t.property("foo", t.string()),
    t.property("bar", t.number()),
    t.property("baz", t.union(t.number(), t.string())),
    t.indexer("key", t.string(), t.number()),
    t.indexer("index", t.number(), t.boolean())
  ));
`;