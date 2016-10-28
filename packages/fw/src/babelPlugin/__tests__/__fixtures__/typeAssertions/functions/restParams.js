/* @flow */

export const input = `
  const demo = (...args: string[]): string[] => args;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (...args) => {
    let _argsType = t.array(t.string());
    const _returnType = t.return(t.array(t.string()));
    t.rest("args", _argsType).assert(args);
    return _returnType.assert(args);
  };

`;