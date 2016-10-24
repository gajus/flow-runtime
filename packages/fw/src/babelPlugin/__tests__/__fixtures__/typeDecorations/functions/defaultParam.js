/* @flow */

export const input = `
  const demo = (input: string = "Hello World"): string => input;
`;

export const expected = `
  import t from "runtime-types";
  const demo = (input = "Hello World") => {
    let _inputType = t.string();
    const _returnType = t.return(t.string());
    t.param("input", _inputType).assert(input);
    return _returnType.assert(input);
  };

`;