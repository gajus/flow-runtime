/* @flow */

export const input = `
  const demo = (): Promise<string> => Promise.resolve("hello world");
`;

export const expected = `
  import t from "flow-runtime";
  const demo = () => {
    const _returnType = t.return(t.string());
    return Promise.resolve("hello world").then(_arg => _returnType.assert(_arg));
  };

`;