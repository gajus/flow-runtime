/* @flow */

import {resolvePath} from '../Validation';
import makeErrorMessage from '../makeErrorMessage';
import type Validation from '../Validation';

export default class JSONErrorReporter<T> {
  validation: Validation<T>;

  constructor (validation: Validation<T>) {
    this.validation = validation;
  }

  report () {
    const {validation} = this;
    if (!validation.hasErrors) {
      return;
    }
    const {input, context} = validation;
    const errors = [];
    for (const [path, code, params] of validation.errors) {
      const actual = context.typeOf(resolvePath(input, path));
      let message;
      if (validation.inputName) {
        message = makeErrorMessage([validation.inputName].concat(path), code, params, actual);
      }
      else {
        message = makeErrorMessage(path, code, params, actual);
      }
      errors.push({path, message});
    }
    return {input, errors};
  }
}