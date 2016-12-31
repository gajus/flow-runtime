/* @flow */

export const input = `
  type Demo = {|
    key: string;
  |};
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.exactObject(
    t.property("key", t.string())
  ));
`;