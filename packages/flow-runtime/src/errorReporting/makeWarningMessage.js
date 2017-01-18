/* @flow */
import {stringifyPath, resolvePath} from '../Validation';

import type Validation from '../Validation';

const delimiter = '\n-------------------------------------------------\n\n';

export default function makeWarningMessage <T> (validation: Validation<T>): ? string {
  if (!validation.hasErrors()) {
    return;
  }
  const {input, context} = validation;
  const collected = [];
  for (const [path, message, expectedType] of validation.errors) {
    const expected = expectedType ? expectedType.toString() : "*";
    const actual = context.typeOf(resolvePath(input, path)).toString();

    const field = stringifyPath(validation.path.concat(path));


    collected.push(
      `${field} ${message}\n\nExpected: ${expected}\n\nActual: ${actual}\n`
    );
  }
  return `Warning: ${collected.join(delimiter)}`;
}
