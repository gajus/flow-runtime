/* @flow */

export const input = `
  const demo = (a: string, b: string): string => a + b;
`;

export const expected = `
  import t from "runtime-types";
  const demo = (a, b) => {
    let _aType = t.string();
    let _bType = t.string();
    const _returnType = t.return(t.string());
    t.param("a", _aType).assert(a);
    t.param("b", _bType).assert(b);
    return _returnType.assert(a + b);
  };

`;