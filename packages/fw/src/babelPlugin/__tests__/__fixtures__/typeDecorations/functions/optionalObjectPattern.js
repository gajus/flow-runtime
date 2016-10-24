/* @flow */

export const input = `
  const demo = ({foo}?: {foo: string}): string => foo;
`;

export const expected = `
  import t from "runtime-types";
  const demo = function ({
      foo
    }?) {
    const _returnType = t.return(t.string());
    t.param("arguments[0]", t.object(
      t.property("foo", t.string())
    ), true).assert(arguments[0]);
    return _returnType.assert(foo);
  };

`;