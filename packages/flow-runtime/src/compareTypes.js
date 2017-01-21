/* @flow */

import type Type from './types/Type';

import {
  AnyType,
  ExistentialType,
  TypeParameter,
  FlowIntoType,
  MixedType,
  TypeAlias
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

  if (a === b) {
    return 0;
  }

  if (b instanceof TypeAlias || b instanceof TypeParameter) {
    b = b.unwrap();
  }

  if (a instanceof TypeAlias) {
    return a.compareWith(b);
  }

  if (a instanceof FlowIntoType || a instanceof TypeParameter || b instanceof FlowIntoType) {
    return a.compareWith(b);
  }
  else if (a instanceof AnyType || a instanceof ExistentialType || a instanceof MixedType) {
    return 1;
  }
  else {
    return a.compareWith(b);
  }
}
