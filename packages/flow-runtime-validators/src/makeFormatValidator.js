/* @flow */

import type {Validator} from './';


export type Options = {
  message?: string;
};


export default function makeFormatValidator (pattern: RegExp, defaultMessage: string) {
  return (options: Options = {}): Validator => {
    const message = options.message;
    return (input: any): ? string => {
      if (!pattern.test(input)) {
        return message || defaultMessage || `must match the pattern: ${String(pattern)}`;
      }
    };
  };
}