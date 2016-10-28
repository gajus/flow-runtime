/* @flow */

export const input = `
 const a = 123 ;
 const b: typeof a = 456;
`;

export const expected = `
  import t from "flow-runtime";
  const a = 123;
  const b = t.typeOf(a).assert(456);
`;