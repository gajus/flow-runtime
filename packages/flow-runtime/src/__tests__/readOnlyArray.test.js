/* @flow */
import {strictEqual, ok} from 'assert';

import t from '../globalContext';
import compareTypes from '../compareTypes';

describe('$ReadOnlyArray', () => {
  it('accepts arrays with matching elements', () => {
    const type = t.$readOnlyArray(t.union(t.string(), t.number()));
    ok(type.accepts([1, 'a']));
    ok(type.accepts([]));
  });

  it('rejects arrays with non-matching elements', () => {
    const type = t.$readOnlyArray(t.number());
    ok(!type.accepts([1, 'a']));
    ok(!type.accepts([1, true]));
  });

  it('rejects non-arrays', () => {
    const type = t.$readOnlyArray(t.number());
    ok(!type.accepts('nope'));
    ok(!type.accepts(42));
    ok(!type.accepts({0: 1, length: 1}));
  });

  it('reports element errors with the correct path', () => {
    const type = t.$readOnlyArray(t.number());
    const validation = t.validate(type, [1, 'two', 3]);
    ok(validation.errors.length > 0, "expected validation errors");
    const errorPaths = validation.errors.map(([path]) => path.join('.'));
    ok(errorPaths.some(p => p.endsWith('1')), 'expected error at index 1, got: ' + errorPaths.join(', '));
  });

  it('stringifies as $ReadOnlyArray<T>', () => {
    strictEqual(t.$readOnlyArray(t.number()).toString(), '$ReadOnlyArray<number>');
  });

  it('accepts mutable arrays as a subtype', () => {
    // every Array<T> is a valid $ReadOnlyArray<T>
    const arr = t.array(t.number());
    const roArr = t.$readOnlyArray(t.number());
    strictEqual(compareTypes(roArr, arr) !== -1, true);
  });

  it('does not treat read-only arrays as mutable arrays', () => {
    // a $ReadOnlyArray<T> cannot flow into Array<T>
    const arr = t.array(t.number());
    const roArr = t.$readOnlyArray(t.number());
    strictEqual(compareTypes(arr, roArr), -1);
  });
});
