/* @flow */

export const input = `
  declare class Thing {
    name: string;
  }

  declare class Place extends Thing {
    url: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare(
    t.class(
      "Thing",
      t.object(
        t.property("name", t.string())
      )
    )
  );

  t.declare(
    t.class(
      "Place",
      t.object(
        t.property("url", t.string())
      ),
      t.extends("Thing")
    )
  );
`;