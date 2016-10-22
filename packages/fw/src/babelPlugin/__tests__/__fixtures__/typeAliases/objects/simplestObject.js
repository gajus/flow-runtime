/* @flow */

export const input = `
  type Demo = {
    key: string;
  };
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.object(
    t.property("key", t.string())
  ));
`;