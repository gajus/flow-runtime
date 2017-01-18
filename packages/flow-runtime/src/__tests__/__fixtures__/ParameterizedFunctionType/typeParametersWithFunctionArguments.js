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

  return fn(callback);
}
