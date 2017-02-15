/* @flow */

export const input = `
type Demo = {
  name: string,
  type: string
};

const task = 123;

export { task };
`;

export const expected = `
import t from "flow-runtime";
const Demo = t.type("Demo", t.object(
  t.property("name", t.string()),
  t.property("type", t.string())
));
const task = 123;

export { task };
`;
