/* @flow */

export const input = `
  class Point <T: number> {
    x: T = 0;
    y: T = 0;
  }
`;

export const expected = `
  import t from "runtime-types";

  @t.decorate(PointType => {
    const T = PointType.typeParameter("T", t.number());
    return t.object(
      t.property("x", T),
      t.property("y", T)
    );
  })
  class Point {
    x = 0;
    y = 0;
  }
`;