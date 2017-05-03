/* @flow */

export const input = `
  type Qux = {
    a: boolean
  };

  type Foo = {
    foo: string,
    bar: number,
    qux: Qux
  };

  declare var obj: Foo;
`;

export const expected = `
  const Qux = {
    a: __abstract("boolean")
  };

  const Foo = {
    foo: __abstract("string"),
    bar: __abstract("number"),
    qux: __abstract(Qux)
  };

  __assumeDataProperty(global, "obj", __abstract(Foo));
`;