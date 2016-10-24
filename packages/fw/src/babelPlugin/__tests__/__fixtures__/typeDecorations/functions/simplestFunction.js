/* @flow */

export const input = `
  const demo = (): string => "hello world";
`;

export const expected = `
  import t from "runtime-types";
  const demo = () => {
    const _returnType = t.return(t.string());
    return _returnType.assert("hello world");
  };

`;