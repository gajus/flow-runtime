/* @flow */

export const input = `
  type Demo = {
    foo?: number;
    [any]: empty;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.exactObject(
    t.property("foo", t.number(), true)
  ));
`;
