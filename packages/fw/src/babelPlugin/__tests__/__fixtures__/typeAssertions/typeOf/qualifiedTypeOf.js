/* @flow */

export const input = `
 const a = {b: 123} ;
 const c: typeof a.b = 456;
`;

export const expected = `
  import t from "flow-runtime";
  const a = { b: 123 };
  const c = t.typeOf(a.b).assert(456);
`;