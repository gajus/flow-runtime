/* @flow */

import {stringifyPath, resolvePath} from '../Validation';
import type Validation from '../Validation';

export default function makeJSONError <T> (validation: Validation<T>) {
  if (!validation.hasErrors()) {
    return;
  }
  const {input, context} = validation;
  const errors = [];
  for (const [path, message, expectedType] of validation.errors) {
    const expected = expectedType ? expectedType.toString() : null;
    const actual = context.typeOf(resolvePath(input, path)).toString();
    const field = stringifyPath(validation.path.concat(path));

    const pointer = `/${path.join('/')}`;

    errors.push({
      pointer,
      field,
      message,
      expected,
      actual
    });
  }
  return errors;
}
