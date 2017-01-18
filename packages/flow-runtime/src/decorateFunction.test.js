/* @flow */

import decorateFunction from './decorateFunction';
import t from './globalContext';
import {throws} from 'assert';

describe('decorateFunction', () => {
  it('should decorate a function', () => {
    const adder = (a: number, b: number) => a + b;
    const type = t.fn(
      t.param('a', t.number()),
      t.param('b', t.number()),
      t.return(t.number())
    );

    const decorated = decorateFunction(type, adder);

    console.log(decorated(1, 2));
  });

  it('should decorate a polymorphic function', () => {
    function adder <T: number | string> (a: T, b: T): T {
      return a + b;
    }
    const type = t.fn((Adder) => {
      const T = Adder.typeParameter('T', t.union(t.number(), t.string()));
      return [
        t.param('a', T),
        t.param('b', T),
        t.return(T)
      ];
    });

    const decorated = decorateFunction(type, adder);

    console.log(decorated(1, 2));
    console.log(decorated('hello ', 'world'));
    throws(() => decorated('hello ', 123));
  });


  it('should decorate a fully polymorphic function', () => {
    function adder <A: number | string, B: number | string> (a: A, b: B): A | B {
      return a + b;
    }
    const type = t.fn((Adder) => {
      const A = Adder.typeParameter('A', t.union(t.number(), t.string()));
      const B = Adder.typeParameter('B', t.union(t.number(), t.string()));
      return [
        t.param('a', A),
        t.param('b', B),
        t.return(t.union(A, B))
      ];
    });

    const decorated = decorateFunction(type, adder);

    console.log(decorated(1, 2));
    console.log(decorated('hello ', 'world'));
    console.log(decorated('hello ', 123));
    throws(() => {
      // @flowIgnore
      return decorated('hello ', {nope: true});
    });
  });

  it('should check a return value', () => {
    const stringer = (input: any): string => input;
    const type = t.fn(
      t.param('input', t.any()),
      t.return(t.string())
    );


    decorateFunction(type, stringer);

    //console.log(decorated(false));
  });


  it('should decorate a generator', () => {
    function *oneTwoThree (): Iterable<number> {
      yield 1;
      yield 2;
      yield 3;
    }
    const type = t.fn(
      t.return(t.ref('Iterable', t.number()))
    );
    const decorated = decorateFunction(type, oneTwoThree);
    for (const value of decorated()) {
      console.log('got', value);
    }
  });


});