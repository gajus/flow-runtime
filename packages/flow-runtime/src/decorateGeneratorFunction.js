/* @flow */

import invariant from './invariant';

import type {
  FunctionType,
  ParameterizedFunctionType
} from './types';


export type DecoratedGeneratorFunction<P, G> = (...args: P[]) => G;

export default function decorateGeneratorFunction <X, P, Y, R, N, G: Generator<Y, R, N>, F: (...args: P[]) => G> (type: FunctionType<P, R> | ParameterizedFunctionType<X, P, R>, fn: F): DecoratedGeneratorFunction<P, G> {


  // const generatorType = type.returnType;

  const decorated = function *decorated (...args: any[]): G {
    type.assertParams(...args);
    const gen: G = fn.apply(this, args);
    let next;
    while (!(next = gen.next()).done) { // eslint-disable-line
      //generatorType.assertYield(next.value);
      const value: any = next.value;
      (value: Y);
      yield value;
    }
    invariant(gen.done, 'Generator has exhausted.');
    const result: any = next.value;
    (result: R);
    //generatorType.assertReturn(result);

    // @flowIgnore
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