/* @flow */

export const input = `
  class Point {
    x: number = 0;
    y: number = 0;

    move (xDiff: number, yDiff: number): Point {
      const point = new Point();
      point.x = this.x + xDiff;
      point.y = this.y + yDiff;
      return point;
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    move(xDiff, yDiff) {
      let _xDiffType = t.number();
      let _yDiffType = t.number();
      const _returnType = t.return(t.ref(Point));
      t.param("xDiff", _xDiffType).assert(xDiff);
      t.param("yDiff", _yDiffType).assert(yDiff);
      const point = new Point();
      point.x = this.x + xDiff;
      point.y = this.y + yDiff;
      return _returnType.assert(point);
    }
  }
`;