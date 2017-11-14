/* @flow */

import type Type from './types/Type';

import {
  AnyType,
  ExistentialType,
  TypeParameter,
  FlowIntoType,
  MixedType,
  TypeAlias,
  TypeParameterApplication,
  TypeTDZ
} from './types';

/**
 * Given two types, A and B, compare them and return either -1, 0, or 1:
 *
 *   -1 if A cannot accept type B.
 *
 *    0 if the types are effectively identical.
 *
 *    1 if A accepts every possible B.
 */
export default function compareTypes (a: Type<any>, b: Type<any>): -1 | 0 | 1 {
  let result;

  if (a === b) {
    return 0;
  }

  if (b instanceof TypeAlias || b instanceof TypeParameter || b instanceof TypeParameterApplication || b instanceof TypeTDZ) {
    b = b.unwrap();
  }

  if (a instanceof TypeAlias) {
    result = a.compareWith(b);
  }
  else if (a instanceof FlowIntoType || a instanceof TypeParameter || b instanceof FlowIntoType) {
    result = a.compareWith(b);
  }
  else if (a instanceof AnyType || a instanceof ExistentialType || a instanceof MixedType) {
    return 1;
  }
  else {
    result = a.compareWith(b);
  }

  if (b instanceof AnyType) {
    // Note: This check cannot be moved higher in the scope,
    // as this would prevent types from being propagated upwards.
    return 1;
  }
  else {
    return result;
  }
}
