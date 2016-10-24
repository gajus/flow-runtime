/* @flow */

export const input = `
  const demo = (a: string, {foo}: {foo: string}): string => a + foo;
`;

export const expected = `
  import t from "runtime-types";
  const demo = function (a, {
      foo
    }) {
    let _aType = t.string();
    const _returnType = t.return(t.string());
    t.param("a", _aType).assert(a);
    t.param("arguments[1]", t.object(
      t.property("foo", t.string())
    )).assert(arguments[1]);
    return _returnType.assert(a + foo);
  };

`;