/* @flow */

export const input = `
  type Demo = (a?: string) => string;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(
    t.param("a", t.string(), true),
    t.return(t.string())
  ));
`;