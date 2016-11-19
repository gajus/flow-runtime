/* @flow */

export const input = `
  class Point <T: number> {
    x: T = 0;
    y: T = 0;

    constructor (x: T, y: T) {
      this.x = x;
      this.y = y;
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(function () {
      return this[t.TypeParametersSymbol].T;
    })
    x = 0;
    @t.decorate(function () {
      return this[t.TypeParametersSymbol].T;
    })
    y = 0;

    constructor(x, y) {
      this[t.TypeParametersSymbol] = {
        T: t.typeParameter("T", t.number())
      };
      let _xType = this[t.TypeParametersSymbol].T;
      let _yType = this[t.TypeParametersSymbol].T;
      t.param("x", _xType).assert(x);
      t.param("y", _yType).assert(y);
      this.x = x;
      this.y = y;
    }
  }
`;