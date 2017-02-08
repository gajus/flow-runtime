/* @flow */

import type Type from './types/Type';

// Tracks whether we're in validation of cyclic objects.
const cyclicValidation = new WeakMap();
// Tracks whether we're toString() of cyclic objects.
const cyclicToString = new WeakSet();

export function inValidationCycle (type: Type<any>, input: any): boolean {
  try {
    const tracked = cyclicValidation.get(type);
    if (!tracked) {
      return false;
    }
    else {
      return weakSetHas(tracked, input);
    }
  }
  catch (e) {
    // some exotic values cannot be checked
    return true;
  }
}

export function startValidationCycle (type: Type<any>, input: any) {
  let tracked = cyclicValidation.get(type);
  if (!tracked) {
    tracked = new WeakSet();
    cyclicValidation.set(type, tracked);
  }
  weakSetAdd(tracked, input);
}

export function endValidationCycle (type: Type<any>, input: any) {
  const tracked = cyclicValidation.get(type);
  if (tracked) {
    weakSetDelete(tracked, input);
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


export function weakSetHas <V: any> (weakset: WeakSet<V>, value: V): boolean {
  try {
    return weakset.has(value);
  }
  catch (e) {
    return true;
  }
}


export function weakSetAdd <V: any> (weakset: WeakSet<V>, value: V) {
  try {
    weakset.add(value);
  }
  catch (e) {}
}


export function weakSetDelete <V: any> (weakset: WeakSet<V>, value: V) {
  try {
    weakset.delete(value);
  }
  catch (e) {}
}