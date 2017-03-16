/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const HasKey = t.type('HasKey', t.object(t.property('getKey', t.function(t.return(t.string())))));

  @t.annotate(t.class('Klazz', t.method('getKey', t.return(t.string()))))
  class Klazz {
    getKey() {
      const _returnType = t.return(t.string());

      return _returnType.assert('key');
    }
  }

  const logKey = t.annotate(function logKey(C) {
    let _CType = t.Class(HasKey);

    t.param('C', _CType).assert(C);

    const instance = new C();
    return instance.getKey();
  }, t.function(t.param('C', t.Class(HasKey))));

  return logKey(Klazz);
}


export function fail (t: TypeContext) {
  const HasKey = t.type('HasKey', t.object(t.property('getKey', t.function(t.return(t.string())))));

  @t.annotate(t.class('Klazz', t.method('getKey', t.return(t.number()))))
  class Klazz {
    getKey() {
      const _returnType = t.return(t.string());

      return _returnType.assert('key');
    }
  }

  const logKey = t.annotate(function logKey(C) {
    let _CType = t.Class(HasKey);

    t.param('C', _CType).assert(C);

    const instance = new C();
    return instance.getKey();
  }, t.function(t.param('C', t.Class(HasKey))));

  return logKey(Klazz);
}