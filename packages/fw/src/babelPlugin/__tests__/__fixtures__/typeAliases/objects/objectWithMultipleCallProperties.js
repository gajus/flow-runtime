/* @flow */

export const input = `
  type Demo = {
    (foo: string): string;
    (bar: boolean): boolean;
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
    ))
  ));
`;