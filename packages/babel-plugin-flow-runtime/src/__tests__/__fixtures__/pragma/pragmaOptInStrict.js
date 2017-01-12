/* @flow */

export const input = `
/* @flow */
/* @flow-runtime */

const Demo = 123;
`;

export const expected = `
import t from "flow-runtime";
/* @flow */
/* @flow-runtime */

const Demo = 123;
`;