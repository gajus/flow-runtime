/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const T = t.type('T', T => {
    const A = T.typeParameter('A');
    return t.object(
      t.property('a', A),
      t.property('b', A)
    );
  });


  function f(x) {
    const A = t.typeParameter('A');
    const _returnType = t.return(A);

    t.openTypeParameters(A);
    let _xType = t.ref(T, A);
    t.param('x', _xType).assert(x);
    t.closeTypeParameters(A);

    return _returnType.assert(x.a);
  }

  return f({ a: 1, b: 's' }); // <= A is number | string
}


export function fail (t: TypeContext) {
  const T = t.type('T', T => {
    const A = T.typeParameter('A');
    return t.object(
      t.property('a', A),
      t.property('b', A)
    );
  });


  function f(x) {
    const A = t.typeParameter('A');
    const _returnType = t.return(A);

    t.openTypeParameters(A);
    let _xType = t.ref(T, A);
    t.param('x', _xType).assert(x);
    t.closeTypeParameters(A);

    return _returnType.assert(false);
  }

  return f({ a: 1, b: 's' }); // <= A is number | string
}