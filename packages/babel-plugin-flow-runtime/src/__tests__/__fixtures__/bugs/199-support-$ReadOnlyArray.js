/* @flow */

export const input = `
type Thing = $ReadOnlyArray<string | number>;

const thing: Thing = [];
`;

export const expected = `
  import t from "flow-runtime";
  const Thing = t.type("Thing", t.array(t.union(t.string(), t.number())));
  const thing = Thing.assert([]);
`;
