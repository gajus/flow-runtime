/* @flow */
import makeJSONError from './errorReporting/makeJSONError';

import type TypeContext from './TypeContext';
import type Type from './types/Type';

export type IdentifierPath = Array<string | number>;
export type ErrorTuple = [IdentifierPath, string, Type<any>];

export type ValidationJSON<T> = {
  input: T;
  errors: Array<{
    pointer: string;
    message: string;
    expected: Type<any>;
    actual: Type<any>;
  }>
};

const validIdentifierOrAccessor = /^[$A-Z_][0-9A-Z_$[\].]*$/i;

export default class Validation<T> {

  context: TypeContext;

  input: T;

  path: string[] = [];

  prefix: string = '';

  errors: ErrorTuple[] = [];

  // Tracks whether we're in validation of cyclic objects.
  cyclic: WeakMap<Type<any>, WeakSet<any>> = new WeakMap();

  constructor (context: TypeContext, input: T) {
    this.context = context;
    this.input = input;
  }

  inCycle (type: Type<any>, input: any): boolean {
    const tracked = this.cyclic.get(type);
    if (!tracked) {
      return false;
    }
    else {
      return tracked.has(input);
    }
  }

  startCycle (type: Type<any>, input: any) {
    let tracked = this.cyclic.get(type);
    if (!tracked) {
      tracked = new WeakSet();
      this.cyclic.set(type, tracked);
    }
    tracked.add(input);
  }

  endCycle (type: Type<any>, input: any) {
    const tracked = this.cyclic.get(type);
    if (tracked) {
      tracked.delete(input);
    }
  }

  hasErrors (path: ? IdentifierPath): boolean {
    if (path) {
      for (const [candidate] of this.errors) {
        if (matchPath(path, candidate)) {
          return true;
        }
      }
      return false;
    }
    else {
      return this.errors.length > 0;
    }
  }

  addError (path: IdentifierPath, expectedType: Type<any>, message: string): this {
    insertError(this.errors, [path, message, expectedType]);
    return this;
  }

  clearError (path: ? IdentifierPath): boolean {
    let didClear = false;
    if (path) {
      const errors = [];
      for (const error of this.errors) {
        if (matchPath(path, error[0])) {
          didClear = true;
        }
        else {
          errors.push(error);
        }
      }
      this.errors = errors;
    }
    else {
      didClear = this.errors.length > 0;
      this.errors = [];
    }
    return didClear;
  }

  resolvePath (path: IdentifierPath): any {
    return resolvePath(this.input, path);
  }

  toJSON (): * {
    return makeJSONError(this);
  }

}

export function stringifyPath (path: IdentifierPath): string {
  if (!path.length) {
    return 'Value';
  }
  const {length} = path;
  const parts = new Array(length);
  for (let i = 0; i < length; i++) {
    const part = path[i];
    if (part === '[[Return Type]]') {
      parts[i] = 'Return Type';
    }
    else if (typeof part !== 'string' || !validIdentifierOrAccessor.test(part)) {
      parts[i] = `[${String(part)}]`;
    }
    else if (i > 0) {
      parts[i] = `.${String(part)}`;
    }
    else {
      parts[i] = String(part);
    }
  }
  return parts.join('');
}

export function resolvePath (input: any, path: IdentifierPath): any {
  let subject = input;
  const {length} = path;
  for (let i = 0; i < length; i++) {
    if (subject == null) {
      return undefined;
    }
    const part = path[i];
    if (part === '[[Return Type]]') {
      continue;
    }
    if (subject instanceof Map) {
      subject = subject.get(part);
    }
    else {
      subject = subject[part];
    }
  }
  return subject;
}

export function matchPath (path: IdentifierPath, candidate: IdentifierPath): boolean {
  const {length} = path;
  if (length > candidate.length) {
    return false;
  }
  for (let i = 0; i < length; i++) {
    if (candidate[i] !== path[i]) {
      return false;
    }
  }
  return true;
}

function insertError (errors: ErrorTuple[], input: ErrorTuple) {
  const [inputPath] = input;
  let candidate = -1;
  for (let i = 0; i < errors.length; i++) {
    const [errorPath] = errors[i];
    const result = comparePaths(errorPath, inputPath);
    if (result === -1) {
      break;
    }
    else {
      candidate = i;
    }
  }
  if (candidate === -1) {
    errors.push(input);
  }
  else {
    errors.splice(candidate, 0, input);
  }
}

function comparePaths (pathA: IdentifierPath, pathB: IdentifierPath) {
  for (let i = 0; i < pathA.length; i++) {
    if (i === pathB.length) {
      return 1;
    }
    const itemA = pathA[i];
    const itemB = pathB[i];
    if (itemA > itemB) {
      return 1;
    }
    else if (itemA < itemB) {
      return -1;
    }
  }
  if (pathB.length > pathA.length) {
    return -1;
  }
  else {
    return 0;
  }
}
