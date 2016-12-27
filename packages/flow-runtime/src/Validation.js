/* @flow */

import getErrorMessage from './getErrorMessage';

import type TypeContext from './TypeContext';
import type Type from './types/Type';

import type {ErrorKey} from './errorMessages';

export type IdentifierPath = Array<string | number>;

export type ValidationJSON<T> = {
  input: T;
  errors: Array<{
    path: IdentifierPath;
    code: ErrorKey;

  }>
};

const validIdentifier = /^[$A-Z_][0-9A-Z_$]*$/i;

export default class Validation<T> {

  context: TypeContext;

  input: T;

  inputName: string = '';

  errors: Array<[IdentifierPath, ErrorKey, any[]]> = [];

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

  constructor (context: TypeContext, input: T) {
    this.context = context;
    this.input = input;
  }

  addError (path: IdentifierPath, expectedType: Type<any>, key: ErrorKey, ...params: any[]): this {
    this.errors.push([path, key, params, expectedType]);
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
    const {input, context, errors} = this;
    const {length} = errors;
    const normalized = new Array(length);
    for (let i = 0; i < length; i++) {
      const [path, code, params, expected] = errors[i];
      const actual = context.typeOf(resolvePath(input, path));
      const message = params ? getErrorMessage(code, ...params)
                             : getErrorMessage(code)
                             ;
      normalized[i] = {path, code, message, actual, expected};
    }
    return {input, errors: normalized};
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
    if (typeof part !== 'string' || !validIdentifier.test(part)) {
      parts[i] = `[${part}]`;
    }
    else if (i > 0) {
      parts[i] = `.${part}`;
    }
    else {
      parts[i] = part;
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

