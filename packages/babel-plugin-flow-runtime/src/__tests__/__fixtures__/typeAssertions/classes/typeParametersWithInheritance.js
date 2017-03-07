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

  type Float = number;
  class FloatPoint extends Point<Float> {
    constructor ([x, y]: [Float, Float]) {
      super(x, y);
    }
  }

  class FPoint<F: Float> extends Point<F> {
    constructor ([x, y]: [F, F]) {
      super(x, y);
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
  }

  const Float = t.type("Float", t.number());
  class FloatPoint extends Point {
    constructor(_arg) {
      let [x, y] = t.tuple(Float, Float).assert(_arg);
      super(x, y);
      t.bindTypeParameters(this, Float);
    }
  }

  const _FPointTypeParametersSymbol = Symbol("FPointTypeParameters");

  class FPoint extends Point {
    static [t.TypeParametersSymbol] = _FPointTypeParametersSymbol;

    constructor(_arg2) {
      const _typeParameters3 = {
        F: t.typeParameter("F", Float)
      };
      let [x, y] = t.tuple(t.flowInto(_typeParameters3.F), t.flowInto(_typeParameters3.F)).assert(_arg2);
      super(x, y);
      this[_FPointTypeParametersSymbol] = _typeParameters3;
      t.bindTypeParameters(this, this[_FPointTypeParametersSymbol].F);
    }
  }
`;