import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

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

    go () {
      const _returnType = t.return(this[_PointTypeParametersSymbol].T);
      return _returnType.assert(this.y);
    }
  }

  const p = new Point(123, true);
  return p.go();
}


export function fail (t: TypeContext) {

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

    go () {
      const _returnType = t.return(this[_PointTypeParametersSymbol].T);
      return _returnType.assert('nope this fails');
    }
  }

  const p = new Point(123, true);
  return p.go();
}