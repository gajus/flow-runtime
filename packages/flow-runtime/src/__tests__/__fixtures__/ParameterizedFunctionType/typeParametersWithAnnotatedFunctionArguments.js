/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  function fn(a) {
    const T = t.typeParameter("T");

    let _aType = t.function(t.return(t.flowInto(T)));

    const _returnType = t.return(t.array(T));

    t.param("a", _aType).assert(a);

    return _returnType.assert([a(), a()]);
  }

  let first = true;

  const callback = () => {
    if (first) {
      first = false;
      return true;
    } else {
      return 123;
    }
  };

  t.annotate(callback, t.function(t.return(t.union(t.boolean(), t.number()))));

  return fn(callback);
}


export function fail (t: TypeContext) {
  function fn(a) {
    const T = t.typeParameter("T");

    let _aType = t.function(t.return(t.flowInto(T)));

    const _returnType = t.return(t.array(T));

    t.param("a", _aType).assert(a);

    return _returnType.assert([a(), a(), 'nope']);
  }

  let first = true;

  const callback = () => {
    if (first) {
      first = false;
      return true;
    } else {
      return 123;
    }
  };

  t.annotate(callback, t.function(t.return(t.union(t.boolean(), t.number()))));

  return fn(callback);
}