/* @flow */

export const input = `
  type Demo = <T: string> () => T;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(_fn => {
    const T = _fn.typeParameter("T", t.string());
    return [t.return(T)];
  }));
`;