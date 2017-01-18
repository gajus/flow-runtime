/* @flow */

export const input = `
  class Point <T: number> {
    x: T = 0;
    y: T = 0;

    constructor (x: T, y: T) {
      this.x = x;
      this.y = y;
    }

    static create (x: T, y: T): Point<T> {
      return new Point(x, y);
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  const _PointTypeParametersSymbol = Symbol("PointTypeParameters");

  class Point {

    static [t.TypeParametersSymbol] = _PointTypeParametersSymbol;

    @t.decorate(function () {
      return t.flowInto(this[_PointTypeParametersSymbol].T);
    })
    x = 0;
    @t.decorate(function () {
      return t.flowInto(this[_PointTypeParametersSymbol].T);
    })
    y = 0;

    constructor(x, y) {
      this[_PointTypeParametersSymbol] = {
        T: t.typeParameter("T", t.number())
      };
      let _xType = t.flowInto(this[_PointTypeParametersSymbol].T);
      let _yType = t.flowInto(this[_PointTypeParametersSymbol].T);
      t.param("x", _xType).assert(x);
      t.param("y", _yType).assert(y);
      this.x = x;
      this.y = y;
    }

    static create(x, y) {
      const _typeParameters = {
        T: t.typeParameter("T", t.number())
      };
      let _xType2 = t.flowInto(_typeParameters.T);
      let _yType2 = t.flowInto(_typeParameters.T);
      const _returnType = t.return(t.ref(Point, _typeParameters.T));
      t.param("x", _xType2).assert(x);
      t.param("y", _yType2).assert(y);
      return _returnType.assert(new Point(x, y));
    }
  }
`;