/* @flow */

export const input = `
  const demo = ([foo]: string[]): string => foo;
`;

export const expected = `
  import t from "runtime-types";
  const demo = function ([foo]) {
    const _returnType = t.return(t.string());
    t.param("arguments[0]", t.array(t.string())).assert(arguments[0]);
    return _returnType.assert(foo);
  };

`;