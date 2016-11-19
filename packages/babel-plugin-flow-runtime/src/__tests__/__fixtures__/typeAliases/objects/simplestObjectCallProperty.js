/* @flow */

export const input = `
  type Demo = {
    (input: string): string;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.object(
    t.callProperty(t.function(
      t.param("input", t.string()),
      t.return(t.string())
    ))
  ));
`;