/* @flow */

export const input = `
  const demo = async (): Promise<string> => "hello world";
`;

export const expected = `
  import t from "flow-runtime";
  const demo = async () => {
    const _returnType = t.return(t.union(t.string(), t.ref("Promise", t.string())));
    return _returnType.assert("hello world");
  };

`;