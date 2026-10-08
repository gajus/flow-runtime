/* @flow */

import type TypeContext from './TypeContext';

export default function registerTypePredicates (context: TypeContext) {
  context.setPredicate('Array', (input: any) => Array.isArray(input));
  context.setPredicate('Map', (input: any) => {
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    // Native Map's internal-slot check works across realms and cannot be
    // forged with prototype inheritance or Symbol.toStringTag.
    try {
      Map.prototype.has.call(input, null);
      return true;
    }
    catch (_) {
      // Object.create(Map.prototype) and Proxy(new Map(), {}) both inherit
      // the native prototype but do not expose Map's internal slots to the
      // intrinsic methods. Do not let them fall through to the structural
      // polyfill check merely because those methods are inherited.
      try {
        if (Map.prototype.isPrototypeOf(input)) {
          return false;
        }
      }
      catch (_) {
        // Revoked/hostile Proxies can throw while walking the prototype chain.
        return false;
      }

      // Keep supporting independent Map polyfills, but accessors, revoked
      // Proxies and hostile Symbol.toStringTag getters must produce false.
      try {
        return Object.prototype.toString.call(input) === '[object Map]'
          && typeof input.get === 'function'
          && typeof input.has === 'function'
          && typeof input.entries === 'function'
          && typeof input[Symbol.iterator] === 'function';
      }
      catch (_) {
        return false;
      }
    }
  });
  context.setPredicate('Set', (input: any) => input instanceof Set);
  context.setPredicate('Promise', (input: any) => {
    if (input instanceof Promise) {
      return true;
    } else {
      return input !== null
        && (typeof input === 'object' || typeof input === 'function')
        && typeof input.then === 'function'
        ;
    }
  });
}
