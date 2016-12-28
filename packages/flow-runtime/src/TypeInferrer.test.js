/* @flow */

import {ok, equal} from 'assert';

import t from './globalContext';

describe('TypeInferrer', () => {

  function test (input: any, expected: string) {
    const type = t.typeOf(input);
    it(`should infer ${expected}`, () => {
      equal(type.toString(), expected);
    });

    it('should be acceptable to the infered type', () => {
      ok(type.accepts(input));
    });
  }

  const sally = {
    id: 123,
    name: 'Sally',
    addresses: [
      {
        line1: '123 Fake Street',
        isActive: true
      },
      {
        line1: '456 Fake Street',
        isActive: false
      }
    ]
  };

  test('hello world', 'string');
  test(123, 'number');
  test(false, 'boolean');
  test(new Date(), 'Date');
  test([1, 2, 3], 'Array<number>');
  test([1, false, 'foo'], 'Array<number | boolean | string>');
  test(
    {
      foo: 123,
      bar: false,
      baz: new Map([
        ['a', 1],
        [true, false],
        [123, 'yes']
      ]),
      method (foo: string, bar: boolean): boolean {
        return bar;
      }
    },
  `{
  foo: number;
  bar: boolean;
  baz: Map<string | boolean | number, number | boolean | string>;
  method: (a: *, b: *) => *;
}`);
  test(sally, `{
  id: number;
  name: string;
  addresses: Array<{
    line1: string;
    isActive: boolean;
  }>;
}`);

});