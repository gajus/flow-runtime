/* @flow */

export const input = `
function testFunction(flag) : string {
  if (flag) {
    return "hello";
  }
}
`;

export const expected = `
import t from "flow-runtime";

function testFunction(flag) {
  const _returnType = t.return(t.string());

  if (flag) {
    return _returnType.assert("hello");
  }

  return _returnType.assert();
}
`;
