/* @flow */

import type TypeContext from './TypeContext';

import type {ErrorKey} from './errorMessages';

export type IdentifierPath = Array<string | number>;

const validIdentifier = /^[$A-Z_][0-9A-Z_$]*$/i;

export default class Validation<T> {

  context: TypeContext;

  input: T;

  inputName: string = '';

  errors: Array<[IdentifierPath, ErrorKey, any[]]> = [];

  get hasErrors (): boolean {
    return this.errors.length > 0;
  }

  constructor (context: TypeContext, input: T) {
    this.context = context;
    this.input = input;
  }

  addError (path: IdentifierPath, key: ErrorKey, ...params: any[]): this {
    this.errors.push([path, key, params]);
    return this;
  }

  resolvePath (path: IdentifierPath): any {
    return resolvePath(this.input, path);
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

