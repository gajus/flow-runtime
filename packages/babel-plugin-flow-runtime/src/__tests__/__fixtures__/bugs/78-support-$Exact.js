/* @flow */

export const input = `
type Demo = $Exact<{
  a: 123
}>
`;

export const expected = `
import t from "flow-runtime";
const Demo = t.type("Demo", t.$exact(
  t.object(
    t.property("a", t.number(123))
  )
));
`;
