/* @flow */

export const input = `
  const demo = (input: string = "Hello World"): string => input;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (input = "Hello World") => {
    let _inputType = t.string();
    const _returnType = t.return(t.string());
    t.param("input", _inputType).assert(input);
    return _returnType.assert(input);
  };
`;


export const annotated = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(input = "Hello World") {
      return input;
    },
    t.function(
      t.param("input", t.string()),
      t.return(t.string())
    )
  );
`;

export const combined = `
  import t from "flow-runtime";
  const demo = t.annotate(
    function demo(input = "Hello World") {
      let _inputType = t.string();
      const _returnType = t.return(t.string());
      t.param("input", _inputType).assert(input);
      return _returnType.assert(input);
    },
    t.function(
      t.param("input", t.string()),
      t.return(t.string())
    )
  );
`;