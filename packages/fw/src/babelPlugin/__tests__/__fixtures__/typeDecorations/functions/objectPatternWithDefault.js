/* @flow */

export const input = `
  const demo = ({foo}: {foo: string} = {foo: "hello world"}): string => foo;
`;

export const expected = `
  import t from "runtime-types";
  const demo = function ({
      foo
    } = {
      foo: "hello world"
    }) {
    const _returnType = t.return(t.string());
    if (arguments[0] !== undefined) {
      t.param("arguments[0]", t.object(
        t.property("foo", t.string())
      )).assert(arguments[0]);
    }
    return _returnType.assert(foo);
  };

`;