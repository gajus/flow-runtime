/* @flow */
import {stringifyPath, resolvePath} from '../Validation';

import type Validation from '../Validation';

import RuntimeTypeError from './RuntimeTypeError';

const delimiter = '\n-------------------------------------------------\n\n';

export default function makeTypeError <T> (validation: Validation<T>) {
  if (!validation.hasErrors()) {
    return;
  }
  const {prefix, input, context, errors} = validation;
  const collected = [];
  for (const [path, message, expectedType] of errors) {
    const expected = expectedType ? expectedType.toString() : "*";
    const actual = resolvePath(input, path);
    const actualType = context.typeOf(actual).toString();

    const field = stringifyPath(validation.path.concat(path));

    const actualAsString = makeString(actual);

    if (typeof actualAsString === 'string') {
      collected.push(`${field} ${message}\n\nExpected: ${expected}\n\nActual Value: ${actualAsString}\n\nActual Type: ${actualType}\n`);
    } else {
      collected.push(
        `${field} ${message}\n\nExpected: ${expected}\n\nActual: ${actualType}\n`
      );
    }
  }
  if (prefix) {
    return new RuntimeTypeError(`${prefix.trim()} ${collected.join(delimiter)}`, {errors});
  }
  else {
    return new RuntimeTypeError(collected.join(delimiter), {errors});
  }
}

function makeString(value: *) {
  if (value === null) {
    return 'null';
  }
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    // @flowIssue
    case 'symbol':
    case 'number':
    case 'boolean':
    case 'undefined':
      return String(value);
    case 'function':
      return;
    default:
      if (Array.isArray(value) || value.constructor == null || value.constructor === Object) {
        try {
          return JSON.stringify(value, null, 2);
        }
        catch (e) {
          return;
        }
      }
      return;
  }
}