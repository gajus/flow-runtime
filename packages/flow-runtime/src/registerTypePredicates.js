/* @flow */

import type TypeContext from './TypeContext';

function isObjectLike (input: any): boolean {
  return input !== null && (typeof input === 'object' || typeof input === 'function');
}

export default function registerTypePredicates (context: TypeContext) {
  context.setPredicate('Array', (input: any) => Array.isArray(input));
  // `instanceof` only covers the current realm's constructor. Maps produced by a
  // spec-compliant polyfill (e.g. core-js via babel-plugin-transform-runtime) or
  // another realm fail it despite implementing the same interface, so fall back
  // to a structural check, mirroring the Promise predicate below.
  context.setPredicate('Map', (input: any) => {
    if (input instanceof Map) {
      return true;
    }
    return isObjectLike(input)
      && typeof input.get === 'function'
      && typeof input.set === 'function'
      && typeof input.has === 'function'
      && typeof input.delete === 'function'
      && typeof input.size === 'number'
      ;
  });
  context.setPredicate('Set', (input: any) => {
    if (input instanceof Set) {
      return true;
    }
    return isObjectLike(input)
      && typeof input.has === 'function'
      && typeof input.add === 'function'
      && typeof input.delete === 'function'
      && typeof input.size === 'number'
      ;
  });
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
