/* @flow */

export const input = `
function throwIfNull<T>(result: ?T): T {
  if (result === null || result === undefined) {
    throw new Error();
  }
  return result;
}
`;

export const expected = `
import t from "flow-runtime";
function throwIfNull(result) {
  const T = t.typeParameter("T");
  let _resultType = t.nullable(t.flowInto(T));
  const _returnType = t.return(T);
  t.param("result", _resultType).assert(result);
  if (result === null || result === undefined) {
    throw new Error();
  }
  return _returnType.assert(result);
}
`;