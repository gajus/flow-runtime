/* @flow */

export const input = `
  function *demo (): Generator<string, void, void> {
    yield "hello world";
  }
`;

export const expected = `
  import t from "flow-runtime";
  function* demo() {
    const _yieldType = t.string();
    const _nextType = t.void();
    const _returnType = t.return(t.void());
    yield _yieldType.assert("hello world");
  }

`;