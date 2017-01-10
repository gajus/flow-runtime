/* @flow */

import type {Validator} from './';

export default function composeValidators (...validators: Validator[]): Validator {
  return (input: any): ? string => {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      const error = validator(input);
      if (typeof error === 'string') {
        return error;
      }
    }
  };
}