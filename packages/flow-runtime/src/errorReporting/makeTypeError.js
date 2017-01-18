/* @flow */
import {stringifyPath, resolvePath} from '../Validation';

import type Validation from '../Validation';

import RuntimeTypeError from './RuntimeTypeError';

const delimiter = '\n-------------------------------------------------\n\n';

export default function makeTypeError <T> (validation: Validation<T>) {
  if (!validation.hasErrors()) {
    return;
  }
  const {prefix, input, context} = validation;
  const collected = [];
  for (const [path, message, expectedType] of validation.errors) {
    const expected = expectedType ? expectedType.toString() : "*";
    const actual = context.typeOf(resolvePath(input, path)).toString();

    const field = stringifyPath(validation.path.concat(path));


    collected.push(
      `${field} ${message}\n\nExpected: ${expected}\n\nActual: ${actual}\n`
    );
  }
  if (prefix) {
    return new RuntimeTypeError(`${prefix.trim()} ${collected.join(delimiter)}`);
  }
  else {
    return new RuntimeTypeError(collected.join(delimiter));
  }
}
