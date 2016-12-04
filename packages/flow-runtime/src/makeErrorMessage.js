/* @flow */

import getErrorMessage from './getErrorMessage';

import {stringifyPath} from './Validation';
import type {ErrorKey} from './errorMessages';
import type {IdentifierPath} from './Validation';


const Placeholder = Symbol('Placeholder');

export default function makeErrorMessage (path: IdentifierPath, key: ErrorKey, params: ?Array<any> = null, actual: any = Placeholder): string {
  const message = params ? getErrorMessage(key, ...params)
                         : getErrorMessage(key)
                         ;
  const prefixed = `${stringifyPath(path)} ${message}`;

  if (actual !== Placeholder) {
    return `${prefixed}, got ${String(actual)}`;
  }
  else {
    return prefixed;
  }
}