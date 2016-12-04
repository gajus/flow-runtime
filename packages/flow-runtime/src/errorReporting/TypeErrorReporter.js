/* @flow */

import type Validation from '../Validation';

import makeErrorMessage from '../makeErrorMessage';

export default class TypeErrorReporter<T> {
  validation: Validation<T>;

  constructor (validation: Validation<T>) {
    this.validation = validation;
  }

  report () {
    const {validation} = this;
    if (!validation.hasErrors) {
      return;
    }
    const {context, errors} = validation;
    if (errors.length === 1) {
      const [path, key, params] = errors[0];
      const actual = context.typeOf(validation.resolvePath(path));
      return new TypeError(makeErrorMessage(path, key, params, actual));
    }
    const collected = [];
    for (const [path, key, params] of errors) {
      const actual = context.typeOf(validation.resolvePath(path));
      collected.push(makeErrorMessage(path, key, params, actual));
    }
    return new TypeError(collected.join('\n\n'));
  }
}
