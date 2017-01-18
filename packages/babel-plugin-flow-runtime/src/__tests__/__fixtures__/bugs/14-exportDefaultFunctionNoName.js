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


export const annotated = `
  import t from "flow-runtime";
  export default t.annotate(
    function (a, b) {
      return a + b;
    },
    t.function(
      t.param("a", t.number()),
      t.param("b", t.number()),
      t.return(t.number())
    )
  );
`;


export const combined = `
  import t from "flow-runtime";
  export default t.annotate(
    function (a, b) {
      let _aType = t.number();
      let _bType = t.number();
      const _returnType = t.return(t.number());
      t.param("a", _aType).assert(a);
      t.param("b", _bType).assert(b);
      return _returnType.assert(a + b);
    },
    t.function(
      t.param("a", t.number()),
      t.param("b", t.number()),
      t.return(t.number())
    )
  );
`;
