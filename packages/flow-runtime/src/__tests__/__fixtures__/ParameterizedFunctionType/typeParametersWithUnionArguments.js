/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  function fn (...args: any[]) {
    const T = t.typeParameter("T");

    let _argsType = t.array(t.flowInto(T));

    const _returnType = t.return(t.array(T));
    t.rest("args", _argsType).assert(args);
    return _returnType.assert(args);
  }

  return fn(1, true, 'yep');
}


export function fail (t: TypeContext) {
  function fn (...args: any[]) {
    const T = t.typeParameter("T");

    let _argsType = t.array(t.flowInto(T));

    const _returnType = t.return(t.array(T));
    t.rest("args", _argsType).assert(args);
    return _returnType.assert([true]);
  }

  return fn(1, 'yep');
}