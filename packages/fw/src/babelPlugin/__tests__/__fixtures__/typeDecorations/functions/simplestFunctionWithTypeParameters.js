/* @flow */

export const input = `
  const demo = <T> (input: T): T => input;
`;

export const expected = `
  import t from "runtime-types";
  const demo = input => {
    const T = t.typeParameter("T");
    let _inputType = T;
    const _returnType = t.return(T);
    t.param("input", _inputType).assert(input);
    return _returnType.assert(input);
  };

`;