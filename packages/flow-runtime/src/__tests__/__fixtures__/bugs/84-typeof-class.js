/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  @t.annotate(t.class("X", t.property("prop2", t.string()), t.method("method", t.param("a", t.string()), t.return(t.number()))))
  class X {
    method(a) {
      let _aType = t.string();

      const _returnType = t.return(t.number());

      t.param("a", _aType).assert(a);
      return _returnType.assert(1);
    }
  }

  let _xType = t.typeOf(X),
      x = _xType.assert(X);

  return x;
}
