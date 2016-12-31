/* @flow */

import type Validation from '../Validation';

import makeErrorMessage from '../makeErrorMessage';

export default function makeTypeError <T> (validation: Validation<T>) {
  if (!validation.hasErrors()) {
    return;
  }
  const {context, errors} = validation;
  let error;
  if (errors.length === 1) {
    const [path, message] = errors[0];
    const actual = context.typeOf(validation.resolvePath(path));
    error = new TypeError(makeErrorMessage(path, message, actual));
  }
  else {
    const collected = [];
    for (const [path, message] of errors) {
      const actual = context.typeOf(validation.resolvePath(path));
      collected.push(makeErrorMessage(path, message, actual));
    }
    error = new TypeError(collected.join('\n\n'));
  }
  error.name = 'RuntimeTypeError';
  return error;
}
