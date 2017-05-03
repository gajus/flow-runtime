/* @flow */

export const input = `
  type A = {a: 123};
  type B = {b: string};

  declare var obj: {...A, ...B};
`;

export const expected = `
  const A = {
    a: __abstract("number")
  };

  const B = {
    b: __abstract("string")
  };

  __assumeDataProperty(global, "obj", __abstract({
    ...A,
    ...B
  }));
`;