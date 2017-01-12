/* @flow */

export const input = `
/* @flow */

const demo = (): string => "hello world";

// $FlowFixMe
const demo2 = (): string => "hello world";
`;

export const expected = `
import t from "flow-runtime";
/* @flow */

const demo = () => {
  const _returnType = t.return(t.string());
  return _returnType.assert("hello world");
};

// $FlowFixMe
const demo2 = () => {
  return "hello world";
};
`;