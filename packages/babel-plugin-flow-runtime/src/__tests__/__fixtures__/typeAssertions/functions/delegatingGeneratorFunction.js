/* @flow */

export const input = `
  function *demo (): Generator<string, void, void> {
    yield* "hello world";
  }
`;

export const expected = `
  import t from "flow-runtime";
  function* demo() {
    const _yieldType = t.string();
    const _nextType = t.void();
    const _returnType = t.return(t.void());
    yield* t.wrapIterator(_yieldType)("hello world");
  }
`;

export const annotated = `
  import t from "flow-runtime";
  function* demo() {
    yield* "hello world";
  }
  t.annotate(demo, t.function(
    t.return(t.ref("Generator", t.string(), t.void(), t.void()))
  ));
`;

export const combined = `
  import t from "flow-runtime";
  function* demo() {
    const _yieldType = t.string();
    const _nextType = t.void();
    const _returnType = t.return(t.void());
    yield* t.wrapIterator(_yieldType)("hello world");
  }
  t.annotate(demo, t.function(
    t.return(t.ref("Generator", t.string(), t.void(), t.void()))
  ));
`;
