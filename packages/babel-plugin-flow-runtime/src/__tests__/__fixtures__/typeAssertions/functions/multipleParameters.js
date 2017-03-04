/* @flow */

export const input = `
  const demo = (a: string, b: string): string => a + b;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (a, b) => {
    let _aType = t.string();
    let _bType = t.string();
    const _returnType = t.return(t.string());
    t.param("a", _aType).assert(a);
    t.param("b", _bType).assert(b);
    return _returnType.assert(a + b);
  };
`;

export const annotated = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(a, b) {
      return a + b;
    },
    t.function(
      t.param("a", t.string()),
      t.param("b", t.string()),
      t.return(t.string())
    )
  );
`;


export const combined = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(a, b) {
      let _aType = t.string();
      let _bType = t.string();
      const _returnType = t.return(t.string());
      t.param("a", _aType).assert(a);
      t.param("b", _bType).assert(b);
      return _returnType.assert(a + b);
    },
    t.function(
      t.param("a", t.string()),
      t.param("b", t.string()),
      t.return(t.string())
    )
  );
`;