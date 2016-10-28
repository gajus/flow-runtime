/* @flow */

export const input = `
  type Demo = (a: number, ...b: string[]) => string;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(
    t.param("a", t.number()),
    t.rest("b", t.array(t.string())),
    t.return(t.string())
  ));
`;