/* @flow */

export const input = `
  type Demo<T> = T;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", Demo => {
    const T = Demo.typeParameter("T");
    return T;
  });
`;