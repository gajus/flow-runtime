/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

  class A {
    x (): this {
      const _returnType = t.return(t.this(this));
      return _returnType.assert(this);
    }
  }

  const a = new A();
  a.x();

  return a;
}


export function fail (t: TypeContext) {

  class A {
    x (): this {
      const _returnType = t.return(t.this(this));
      // @flowIgnore expected error
      return _returnType.assert(new A());
    }
  }

  const a = new A();
  a.x();

  return a;
}