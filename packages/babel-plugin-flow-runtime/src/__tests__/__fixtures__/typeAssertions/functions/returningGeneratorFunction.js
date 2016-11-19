/* @flow */

export const input = `
  function *demo (): Generator<string, boolean, void> {
    yield* "hello world";
    return true;
  }
`;

export const expected = `
  import t from "flow-runtime";
  function* demo() {
    const _yieldType = t.string();
    const _nextType = t.void();
    const _returnType = t.return(t.boolean());
    yield* t.wrapIterator(_yieldType)("hello world");
    return _returnType.assert(true);
  }

`;