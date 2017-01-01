/* @flow */
import type Type from './types/Type';
import invariant from './invariant';

type WeakTypeTree = WeakMap<Type<any>, Type<any> | WeakTypeTree>;

const caches = [
  new WeakMap(),
  new WeakMap(),
  new WeakMap(),
  new WeakMap(),
  new WeakMap()
];

export function memoize (object: Object, propertyName: string, descriptor: Object) {
  const original = descriptor.value;
  const fn = function memoized (...args: Type<any>[]): Type<any> {
    const cached = get(this, args);
    if (cached) {
      return cached;
    }
    const value = original.apply(this, args);
    set(this, args, value);
    return value;
  };

  Object.defineProperty(fn, 'name', {value: propertyName});
  descriptor.value = fn;
  return descriptor;
}


export function get (container: Type<any>, params: Type<any>[]): ? Type<any> {
  const paramsLength = params.length;
  const cache = caches[paramsLength];
  if (!cache) {
    return;
  }
  else if (paramsLength === 0) {
    return cache.get(container);
  }
  let subject = cache;
  for (let i = 0; i < paramsLength; i++) {
    if (!subject) {
      return;
    }
    const param = params[i];
    subject = subject.get(param);
  }
  return (subject: $FlowIgnore);
}


export function has (container: Type<any>, params: Type<any>[]): boolean {
  const paramsLength = params.length;
  const cache = caches[paramsLength];
  if (!cache) {
    return false;
  }
  else if (paramsLength === 0) {
    return cache.has(container);
  }
  let subject = cache;
  for (let i = 0; i < paramsLength; i++) {
    if (!subject) {
      return false;
    }
    const param = params[i];
    subject = subject.get(param);
  }
  return subject ? true : false;
}

export function set (container: Type<any>, params: Type<any>[], value: Type<any>) {
  const paramsLength = params.length;
  const cache = caches[paramsLength];
  if (!cache) {
    return;
  }
  else if (paramsLength === 0) {
    cache.set(container, value);
    return;
  }
  let subject = cache;
  for (let i = 0; i < paramsLength; i++) {
    const param = params[i];
    invariant(subject instanceof WeakMap);
    if (i === paramsLength - 1) {
      subject.set(param, value);
    }
    else if (!subject.has(param)) {
      const child = new WeakMap();
      (subject: $FlowIgnore).set(param, child);
      subject = child;
    }
    else {
      subject = subject.get(param);
    }
  }
}