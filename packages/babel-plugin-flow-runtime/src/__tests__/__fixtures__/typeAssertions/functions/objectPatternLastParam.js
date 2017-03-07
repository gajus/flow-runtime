/* @flow */

export const input = `
  const demo = (a: string, {foo}: {foo: string}): string => a + foo;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (a, _arg) => {
    let _aType = t.string();
    const _returnType = t.return(t.string());
    t.param("a", _aType).assert(a);
    let { foo }  = t.object(
      t.property("foo", t.string())
    ).assert(_arg);
    return _returnType.assert(a + foo);
  };

`;