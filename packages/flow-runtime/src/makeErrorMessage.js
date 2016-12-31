/* @flow */

import {stringifyPath} from './Validation';
import type {IdentifierPath} from './Validation';

const Placeholder = Symbol('Placeholder');

export default function makeErrorMessage (path: IdentifierPath, message: string, actual: any = Placeholder): string {
  const prefixed = `${stringifyPath(path)} ${message}`;

  if (actual !== Placeholder) {
    return `${prefixed}, got ${String(actual)}`;
  }
  else {
    return prefixed;
  }
}