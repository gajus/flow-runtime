/* @flow */

import Type from './types/Type';

import {TypeSymbol} from './symbols';

export type Decorator<T> = (input: T) => T;

declare function annotateValue <T> (type: Type<T>): Decorator<T>;
declare function annotateValue <T> (input: T, type: Type<T>): T; // eslint-disable-line no-redeclare

export default function annotateValue (input, type?) { // eslint-disable-line no-redeclare
  if (type instanceof Type) {
    input[TypeSymbol] = type;
    return input;
  }
  else {
    const type = input;
    return (input) => {
      input[TypeSymbol] = type;
      return input;
    };
  }
}