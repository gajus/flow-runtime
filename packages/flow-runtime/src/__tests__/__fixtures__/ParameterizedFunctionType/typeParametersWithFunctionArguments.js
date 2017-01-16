/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  function fn(a) {
    const T = t.typeParameter("T");

    let _aType = t.function(t.return(T));

    const _returnType = t.return(t.array(T));
    t.openTypeParameters(T);
    t.param("a", _aType).assert(a);
    t.closeTypeParameters(T);
    return _returnType.assert([a(), a()]);
  }

  let run = false;
  return fn(() => !run ? (run = true, 123) : 'nope');
}


export function fail (t: TypeContext) {
  function fn (...args: any[]) {
    const T = t.typeParameter("T");

    let _argsType = t.array(T);

    const _returnType = t.return(t.array(T));
    t.openTypeParameters(T);
    t.rest("args", _argsType).assert(args);
    t.closeTypeParameters(T);
    return _returnType.assert([true]);
  }

  return fn(1, 'yep');
}