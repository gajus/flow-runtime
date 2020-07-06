/* @flow */

export const input = `
function testFunction() : string {

}
`;

export const expected = `
import t from "flow-runtime";

function testFunction() {
  const _returnType = t.return(t.string());
  return _returnType.assert();
}
`;
