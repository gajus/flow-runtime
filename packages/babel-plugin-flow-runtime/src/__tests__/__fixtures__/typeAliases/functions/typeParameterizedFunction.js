/* @flow */

export const input = `
  type Demo = <T> (a: T) => T;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(_fn => {
    const T = _fn.typeParameter("T");
    return [
      t.param("a", T),
      t.return(T)
    ];
  }));
`;