/* @flow */

export const input = `
export default (): string => "hello world";
`;

export const expected = `
  import t from "flow-runtime";

  export default (() => {
    const _returnType = t.return(t.string());
    return _returnType.assert("hello world");
  });
`;