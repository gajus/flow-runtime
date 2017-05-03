/* @flow */

export const input = `
  interface A {
    a: string;
  }

  declare var obj: A;
`;

export const expected = `
  const A = {
    a: __abstract("string")
  };

  __assumeDataProperty(global, "obj", __abstract(A));
`;