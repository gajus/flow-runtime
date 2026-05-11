/* @flow */

import type TypeContext from './TypeContext';

const objectToString = Object.prototype.toString;

const isMap = (input: any): boolean => {
  return input instanceof Map || objectToString.call(input) === '[object Map]';
};

export default function registerTypePredicates (context: TypeContext) {
  context.setPredicate('Array', (input: any) => Array.isArray(input));
  context.setPredicate('Map', isMap);
  context.setPredicate('Set', (input: any) => input instanceof Set);
  context.setPredicate('Promise', (input: any) => {
    if (input instanceof Promise) {
      return true;
    } else {
      return input !== null
        && (typeof input === 'object' || typeof input === 'function')
        && typeof input.then === 'function'
        ;
    }
  });
}
