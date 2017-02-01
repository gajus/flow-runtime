/* @flow */

export const input = `
type Demo = {key: string} & {value: number};
({key: "foo", value: 123}: Demo);
`;

export const expected = `
import t from "flow-runtime";
const Demo = t.type("Demo", t.intersection(
  t.object(
    t.property("key", t.string())
  ),
  t.object(
    t.property("value", t.number())
  )
));

Demo.assert({
  key: "foo",
  value: 123
});
`;
