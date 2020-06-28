/* @flow */

export const input = `
  function *demo (): Generator<string, boolean, number> {
    const result = yield* "hello world";
    return result > 2 ? true : false;
  }
`;

export const expected = `
  import t from "flow-runtime";
  function* demo() {
    const _yieldType = t.string();
    const _nextType = t.number();
    const _returnType = t.return(t.boolean());
    const result = _nextType.assert(yield* t.wrapIterator(_yieldType)("hello world"));
    return _returnType.assert(result > 2 ? true : false);
  }

`;
