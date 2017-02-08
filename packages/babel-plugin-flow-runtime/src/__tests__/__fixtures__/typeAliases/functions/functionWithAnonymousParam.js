/* @flow */

export const input = `
  type Demo = (string) => string;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(
    t.param("_arg0", t.string()),
    t.return(t.string())
  ));
`;