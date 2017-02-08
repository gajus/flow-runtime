/* @flow */

export const input = `
 declare var a: {b: number};
 const c: typeof a.b = 456;
`;

export const expected = `
  import t from "flow-runtime";
  t.declare(t.var(
    "a",
    t.object(
      t.property("b", t.number())
    )
  ));
  const c = t.get("a", "b").assert(456);
`;