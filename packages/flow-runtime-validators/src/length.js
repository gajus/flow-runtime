/* @flow */
import type {Validator} from './';

export type Options = {
  min?: number;
  max?: number;
  exact?: number;
  message?: string;
};

type Lengthful = {
  length: number;
};

const defaultOptions: Options = {min: 1, max: 1024 * 1024};

export default function lengthValidator (options: Options = defaultOptions): Validator {

  const {min, max, exact, message} = options;

  if (typeof exact === 'number') {
    return (input: any): ? string => {
      return warnMissingLength(input, message)
          || warnExactLength(input, exact, message)
          ;
    };
  }
  else if (typeof min === 'number' && typeof max === 'number') {
    return (input: any): ? string => {
      return warnMissingLength(input, message)
          || warnMinLength(input, min, message)
          || warnMaxLength(input, max, message)
          ;
    };
  }
  else if (typeof min === 'number') {
    return (input: any): ? string => {
      return warnMissingLength(input, message)
          || warnMinLength(input, min, message)
          ;
    };
  }
  else if (typeof max === 'number') {
    return (input: any): ? string => {
      return warnMissingLength(input, message)
          || warnMaxLength(input, max, message)
          ;
    };
  }
  else {
    throw new Error("Length Validator requires 'min' and/or 'max' or 'exact' properties.");
  }

}

function warnMissingLength (input: any, message: ? string): ? string {
  if (input == null || typeof input.length !== 'number') {
    return message || 'must have a length';
  }
}

function warnExactLength (input: Lengthful, exact: number, message: ? string): ? string {
  if (input.length !== exact) {
    return message || `length must be exactly: ${exact}`;
  }
}

function warnMinLength (input: Lengthful, min: number, message: ? string): ? string {
  if (input.length < min) {
    return message || `length must be at least: ${min}`;
  }
}

function warnMaxLength (input: Lengthful, max: number, message: ? string): ? string {
  if (input.length > max) {
    return message || `length must be at most: ${max}`;
  }
}