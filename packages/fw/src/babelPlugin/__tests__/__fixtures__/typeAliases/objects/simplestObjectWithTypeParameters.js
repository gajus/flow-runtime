/* @flow */

export const input = `
  type Demo<T: string> = {
    key: T;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", Demo => {
    const T = Demo.typeParameter("T", t.string());
    return t.object(
      t.property("key", T)
    );
  });
`;