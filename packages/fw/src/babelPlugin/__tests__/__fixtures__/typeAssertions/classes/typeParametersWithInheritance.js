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

  const Float = t.type("Float", t.number());
  class FloatPoint extends Point {
    constructor([x, y]) {
      t.param("arguments[0]", t.tuple(Float, Float)).assert(arguments[0]);
      super(x, y);
      t.bindTypeParameters(this, Float);
    }
  }

  class FPoint extends Point {
    constructor([x, y]) {
      const _typeParameters3 = {
        F: t.typeParameter("F", Float)
      };
      t.param("arguments[0]", t.tuple(_typeParameters3.F, _typeParameters3.F)).assert(arguments[0]);
      super(x, y);
      if (this[t.TypeParametersSymbol]) {
        Object.assign(this[t.TypeParametersSymbol], _typeParameters3);
      }
      else {
        this[t.TypeParametersSymbol] = _typeParameters3;
      }
      t.bindTypeParameters(this, this[t.TypeParametersSymbol].F);
    }
  }
`;