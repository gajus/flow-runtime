/* @flow */

export const input = `
  function* someGenerator(): any {
    yield 12;
    yield 42;
  }

  for (const it of someGenerator()) {
    console.log(it);
  }
`;

export const expected = `
  import t from "flow-runtime";
  function* someGenerator() {
    const _returnType2 = t.return(t.any());
    yield 12;
    yield 42;
  }

  for (const it of someGenerator()) {
    console.log(it);
  }
`;