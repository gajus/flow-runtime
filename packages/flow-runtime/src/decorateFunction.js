/* @flow */

import type {
  FunctionType,
  ParameterizedFunctionType
} from './types';


export type DecoratedFunction<P, R> = (...args: P[]) => R;

export default function decorateFunction <X, P, R, F: (...args: P[]) => R> (type: FunctionType<P, R> | ParameterizedFunctionType<X, P, R>, fn: F): DecoratedFunction<P, R> {

  const decorated = function decorated (...args: any[]) {
    type.assertParams(...args);
    const result = fn.apply(this, args);
    type.assertReturn(result);
    return result;
  };

  Object.defineProperties(decorated, {
    name: {
      value: fn.name || 'anonymous'
    },
    length: {
      value: fn.length
    }
  });

  return decorated;
}