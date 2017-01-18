import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const {MixedPoint} = makeClasses(t);

  const point = new MixedPoint([10, true]);
  return point.pass();
}

export function fail (t: TypeContext) {
  const {MixedPoint} = makeClasses(t);

  const point = new MixedPoint([10, true]);
  return point.fail();
}

function makeClasses (t: TypeContext) {
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
        T: t.typeParameter("T")
      };
      let _xType = t.flowInto(this[_PointTypeParametersSymbol].T);
      let _yType = t.flowInto(this[_PointTypeParametersSymbol].T);
      t.param("x", _xType).assert(x);
      t.param("y", _yType).assert(y);
      this.x = x;
      this.y = y;
    }
  }

  const _MixedPointTypeParametersSymbol = Symbol("MixedPointTypeParameters");

  class MixedPoint extends Point {
    static [t.TypeParametersSymbol] = _MixedPointTypeParametersSymbol;

    constructor([x, y]) {
      const _typeParameters3 = {
        F: t.typeParameter("F")
      };
      t.param(
        "arguments[0]",
        t.tuple(
          t.flowInto(_typeParameters3.F),
          t.flowInto(_typeParameters3.F)
        )
      ).assert(arguments[0]);

      super(x, y);
      this[_MixedPointTypeParametersSymbol] = _typeParameters3;
      t.bindTypeParameters(this, this[_MixedPointTypeParametersSymbol].F);
    }

    pass () {
      const _returnType = t.return(this[_MixedPointTypeParametersSymbol].F);
      _returnType.assert(this.x);
      return _returnType.assert(this.y);
    }

    fail () {
       const _returnType = t.return(this[_MixedPointTypeParametersSymbol].F);
      return _returnType.assert('bad. this is bad');
    }
  }

  return {Point, MixedPoint};
}
