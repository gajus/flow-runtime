/* @flow */

export const input = `
  const demo = ([foo]: string[]): string => foo;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = function ([foo]) {
    const _returnType = t.return(t.string());
    t.param("arguments[0]", t.array(t.string())).assert(arguments[0]);
    return _returnType.assert(foo);
  };
`;

export const decorated = `
  import t from "flow-runtime";
  const demo = t.annotate(
    ([foo]) => {
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
    function ([foo]) {
      const _returnType = t.return(t.string());
      t.param("arguments[0]", t.array(t.string())).assert(arguments[0]);
      return _returnType.assert(foo);
    },
    t.function(
      t.param("_arg", t.array(t.string())),
      t.return(t.string())
    )
  );
`;