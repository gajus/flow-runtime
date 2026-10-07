/* @flow */

export const input = `
async function testFunction(flag) : Promise<string> {
  if (flag) {
    return "hello";
  }
}
`;

export const expected = `
import t from "flow-runtime";

async function testFunction(flag) {
  const _returnType = t.return(t.union(t.string(), t.ref("Promise", t.string())));

  if (flag) {
    return _returnType.assert("hello");
  }

  return _returnType.assert();
}
`;
