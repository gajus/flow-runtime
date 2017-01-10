/* @flow */

import type {Validator} from '../';

export type Options = {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  exact?: number;
  divisibleBy?: number;
  integer?: boolean;
  message?: string;
};


export default function numberValidator ({gt, gte, lt, lte, exact, divisibleBy, integer, message}: Options): Validator {
  if (typeof exact === 'number') {
    return (input: any): ? string => {
      if (input !== exact) {
        return message || `must be exactly ${String(exact)}`;
      }
    };
  }
  else {
    return (input: any): ? string => {
      if (typeof input !== 'number' || isNaN(input)) {
        return message || 'must be a valid number';
      }
      else if (typeof gt === 'number' && input <= gt) {
        return message || `must be greater than ${String(gt)}`;
      }
      else if (typeof gte === 'number' && input < gte) {
        return message || `must be greater than or equal to ${String(gte)}`;
      }
      else if (typeof lt === 'number' && input >= lt) {
        return message || `must be less than ${String(lt)}`;
      }
      else if (typeof lte === 'number' && input > lte) {
        return message || `must be less than or equal to ${String(lte)}`;
      }
      else if (typeof divisibleBy === 'number' && (input % divisibleBy) !== 0) {
        return message || `must be divisible by ${String(divisibleBy)}`;
      }
      else if (integer && Math.floor(input) !== input) {
        return message || 'must be an integer';
      }
    };
  }
}