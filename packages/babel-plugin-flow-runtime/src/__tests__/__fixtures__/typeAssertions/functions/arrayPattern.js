/* @flow */

export const input = `
  const demo = ([foo]: string[]): string => foo;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = _arg => {
    const _returnType = t.return(t.string());
    let [foo] = t.array(t.string()).assert(_arg);
    return _returnType.assert(foo);
  };
`;

export const annotated = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(_arg) {
      let [foo] = _arg;
      return foo;
    },
    t.function(
      t.param("_arg", t.array(t.string())),
      t.return(t.string())
    )
  );
`;

export const combined = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(_arg) {
      const _returnType = t.return(t.string());
      let [foo] = t.array(t.string()).assert(_arg);
      return _returnType.assert(foo);
    },
    t.function(
      t.param("_arg", t.array(t.string())),
      t.return(t.string())
    )
  );
`;