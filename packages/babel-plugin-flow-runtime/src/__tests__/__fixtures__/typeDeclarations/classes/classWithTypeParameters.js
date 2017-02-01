/* @flow */

export const input = `
  declare class Thing<T: string> {
    name: T;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.class("Thing", _Thing => {
    const T = _Thing.typeParameter("T", t.string());
    return [
      t.object(
        t.property("name", T)
      )
    ];
  }));
`;