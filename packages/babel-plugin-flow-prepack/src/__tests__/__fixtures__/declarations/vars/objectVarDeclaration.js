/* @flow */

export const input = `
  declare var obj: {
    foo: string,
    bar: number,
    qux: {
      a: boolean
    }
  };
`;

export const expected = `
  __assumeDataProperty(global, "obj", __abstract({
    foo: __abstract("string"),
    bar: __abstract("number"),
    qux: __abstract({
      a: __abstract("boolean")
    })
  }));
`;