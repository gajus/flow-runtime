/* @flow */

import vm from 'vm';

import type TypeContext from '../../../TypeContext';

// Mirrors https://github.com/gajus/flow-runtime/issues/177: babel-plugin-transform-runtime
// rewrites `new Map()` to core-js's polyfill, so instances are not `instanceof` the global
// constructor and validation must fall back to the structural interface. A cross-realm
// constructor reproduces the same mismatch without the polyfill dependency.
export function pass (t: TypeContext) {
  const RealmMap = vm.runInNewContext('Map');
  const RealmSet = vm.runInNewContext('Set');
  const map = new RealmMap([['a', 1]]);
  const set = new RealmSet([1]);

  if (!t.checkPredicate('Map', map)) {
    throw new Error('cross-realm Map should satisfy the Map predicate');
  }
  if (!t.checkPredicate('Set', set)) {
    throw new Error('cross-realm Set should satisfy the Set predicate');
  }
  if (!t.checkPredicate('Map', new Map())) {
    throw new Error('native Map should satisfy the Map predicate');
  }
  if (!t.checkPredicate('Set', new Set())) {
    throw new Error('native Set should satisfy the Set predicate');
  }
  return true;
}

export function fail (t: TypeContext) {
  // structural acceptance must not become a free-for-all: values missing the
  // interface are still rejected. When the predicate is correct this always throws.
  for (const impostor of [
    {},
    {get: () => {}, set: () => {}, has: () => {}, delete: () => {}},
    {has: () => {}, add: () => {}, delete: () => {}, size: 'not-a-number'},
    null,
    'Map'
  ]) {
    if (t.checkPredicate('Map', impostor) || t.checkPredicate('Set', impostor)) {
      return;
    }
  }
  throw new Error('impostors were correctly rejected by the Map and Set predicates');
}
