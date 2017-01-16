/* @flow */

export const input = `
  const demo = <T> (input: T): () => T => (): T => input;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = input => {
    const T = t.typeParameter("T");
    let _inputType = t.flowInto(T);
    const _returnType = t.return(t.function(t.return(T)));
    t.param("input", _inputType).assert(input);
    return _returnType.assert(() => {
      const _returnType2 = t.return(T);
      return _returnType2.assert(input);
    });
  };

`;