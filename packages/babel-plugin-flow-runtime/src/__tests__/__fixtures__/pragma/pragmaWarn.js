/* @flow */

export const input = `
/* @flow */
/* @flow-runtime warn */

type Demo = 123;

("nope": Demo);
`;

export const expected = `
import t from "flow-runtime";
/* @flow */
/* @flow-runtime warn */

const Demo = t.type("Demo", t.number(123));

t.warn(Demo, "nope");
`;