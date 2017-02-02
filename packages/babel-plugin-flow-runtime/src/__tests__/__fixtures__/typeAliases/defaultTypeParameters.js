/* @flow */

export const input = `
  type Demo<T=number> = {
    x: T;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", Demo => {
    const T = Demo.typeParameter("T", undefined, t.number());
    return t.object(
      t.property("x", T)
    );
  });
`;