/* @flow */

export const input = `
  class Thing {
    name: string;
  }

  declare class Place extends Thing {
    url: string;
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Thing {
    @t.decorate(t.string())
    name;
  }

  t.declare(
    t.class(
      "Place",
      t.object(
        t.property("url", t.string())
      ),
      t.extends(Thing)
    )
  );
`;