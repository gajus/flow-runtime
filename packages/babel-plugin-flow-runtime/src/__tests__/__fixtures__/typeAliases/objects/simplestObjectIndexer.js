/* @flow */

export const input = `
  type Demo = {
    [key: string]: number;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.object(
    t.indexer("key", t.string(), t.number())
  ));
`;