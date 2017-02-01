/* @flow */

export const input = `
  declare class Thing<T> {
    id: T;
    name: string;
  }

  declare class Place extends Thing<string> {
    url: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(t.class("Thing", _Thing => {
    const T = _Thing.typeParameter("T");
    return [
      t.object(
        t.property("id", T),
        t.property("name", t.string())
      )
    ];
  }));

  t.declare(t.class(
    "Place",
    t.object(
      t.property("url", t.string())
    ),
    t.extends("Thing", t.string())
  ));
`;