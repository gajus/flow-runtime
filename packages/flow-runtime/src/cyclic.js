/* @flow */

import type Type from './types/Type';

// Tracks whether we're in validation of cyclic objects.
const cyclicValidation = new WeakMap();
// Tracks whether we're toString() of cyclic objects.
const cyclicToString = new WeakSet();

export function inValidationCycle (type: Type<any>, input: any): boolean {
  const tracked = cyclicValidation.get(type);
  if (!tracked) {
    return false;
  }
  else {
    return tracked.has(input);
  }
}

export function startValidationCycle (type: Type<any>, input: any) {
  let tracked = cyclicValidation.get(type);
  if (!tracked) {
    tracked = new WeakSet();
    cyclicValidation.set(type, tracked);
  }
  tracked.add(input);
}

export function endValidationCycle (type: Type<any>, input: any) {
  const tracked = cyclicValidation.get(type);
  if (tracked) {
    tracked.delete(input);
  }
}

export function inToStringCycle (type: Type<any>): boolean {
  return cyclicToString.has(type);
}

export function startToStringCycle (type: Type<any>) {
  cyclicToString.add(type);
}

export function endToStringCycle (type: Type<any>) {
  cyclicToString.delete(type);
}
