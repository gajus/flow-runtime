/* @flow */

export const input = `
  declare class Thing {
    name: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  t.declare("Thing",
    t.class(
      "Thing",
      t.object(
        t.property("name", t.string())
      )
    )
  );
`;