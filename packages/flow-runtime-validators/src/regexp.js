/* @flow */

import type {Validator} from './';

export type Options = {
  pattern: string | RegExp;
  message?: string;
};


export default function regexpValidator (options: Options): Validator {
  const message = options.message;

  const pattern = options.pattern instanceof RegExp
                ? options.pattern
                : new RegExp(options.pattern)
                ;

  return (input: any): ? string => {
    if (!pattern.test(input)) {
      return message || `must match the pattern: ${String(pattern)}`;
    }
  };
}