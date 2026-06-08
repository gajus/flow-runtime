/* @flow */

export const input = `
function testFunction() : string {
  const value = "hello";
  value.toUpperCase();
}
`;

export const expected = `
import t from "flow-runtime";

function testFunction() {
  const _returnType = t.return(t.string());

  const value = "hello";
  value.toUpperCase();
  return _returnType.assert();
}
`;
