/* @flow */

import {resolvePath} from '../Validation';
import makeErrorMessage from '../makeErrorMessage';
import getErrorMessage from '../getErrorMessage';
import {stringifyPath} from '../Validation';
import type Validation from '../Validation';

export default class JSONErrorReporter<T> {
  validation: Validation<T>;

  constructor (validation: Validation<T>) {
    this.validation = validation;
  }

  report () {
    const {validation} = this;
    if (!validation.hasErrors()) {
      return;
    }
    const {input, context} = validation;
    const errors = [];
    for (const [path, errorKey, params, expectedType] of validation.errors) {
      const expected = expectedType ? expectedType.toString() : null;
      const actual = context.typeOf(resolvePath(input, path)).toString();
      const field = stringifyPath(validation.inputName ? [validation.inputName].concat(path) : path);

      const message = params
                    ? getErrorMessage(errorKey, ...params)
                    : getErrorMessage(errorKey)
                    ;

      const pointer = `/${path.join('/')}`;

      errors.push({
        pointer,
        message,
        field,
        expected,
        actual
      });
    }
    return {input, errors};
  }
}