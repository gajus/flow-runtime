/* @flow */

export const input = `
export default function (a: number, b:number): number {
  return a + b;
}
`;

export const expected = `
  import t from "flow-runtime";

  export default function (a, b) {
    let _aType = t.number();
    let _bType = t.number();
    const _returnType = t.return(t.number());
    t.param("a", _aType).assert(a);
    t.param("b", _bType).assert(b);
    return _returnType.assert(a + b);
  }
`;