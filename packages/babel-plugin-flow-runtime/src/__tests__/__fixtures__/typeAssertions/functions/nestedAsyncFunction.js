/* @flow */

export const input = `
  const demo = async (): Promise<string> => "hello world";
`;

export const expected = `
  import t from "flow-runtime";
  const demo = async () => {
    const _returnType = t.return(t.string());
    return _returnType.assert("hello world");
  };

`;