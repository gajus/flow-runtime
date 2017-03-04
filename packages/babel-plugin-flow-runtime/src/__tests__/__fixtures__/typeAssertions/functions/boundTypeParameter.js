/* @flow */

export const input = `
  const demo = <T: string> (input: T): T => input;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = input => {
  const T = t.typeParameter("T", t.string());
    let _inputType = t.flowInto(T);
    const _returnType = t.return(T);
    t.param("input", _inputType).assert(input);
    return _returnType.assert(input);
  };
`;


export const annotated = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(input) {
      return input;
    },
    t.function(_fn => {
      const T = _fn.typeParameter("T", t.string());
      return [
        t.param("input", t.flowInto(T)),
        t.return(T)
      ];
    })
  );
`;

export const combined = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(input) {
      const T = t.typeParameter("T", t.string());
      let _inputType = t.flowInto(T);
      const _returnType = t.return(T);
      t.param("input", _inputType).assert(input);
      return _returnType.assert(input);
    },
    t.function(_fn => {
      const T = _fn.typeParameter("T", t.string());
      return [
        t.param("input", t.flowInto(T)),
        t.return(T)
      ];
    })
  );
`;