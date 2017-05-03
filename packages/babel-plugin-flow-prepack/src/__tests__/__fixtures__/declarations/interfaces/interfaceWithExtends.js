/* @flow */

export const input = `
  interface A {
    a: string;
  }

  interface B extends A {
    b: 123
  }

  declare var obj: B;
`;

export const expected = `
  const A = {
    a: __abstract("string")
  };

  const B = {
    ...A,
    ...{
      b: __abstract("number")
    }
  };

  __assumeDataProperty(global, "obj", __abstract(B));
`;