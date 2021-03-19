/* @flow */

export const input = `
type Demo = $ReadOnlyArray<number>;
const test: Demo = [123];
test.push(4);
`;

export const expected = `
import t from "flow-runtime";
const Demo = t.type("Demo", t.$readOnlyArray(t.number()));
const test = Demo.assert([123]);
test.push(4);
`;
