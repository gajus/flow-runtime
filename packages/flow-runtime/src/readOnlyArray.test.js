/* @flow */
import {ok, strictEqual, notStrictEqual, throws} from 'assert';
import t from './globalContext';

describe('$ReadOnlyArray', () => {
  it('checks elements and rejects non-arrays', () => {
    const type = t.ref('$ReadOnlyArray', t.number());
    ok(type.accepts([]));
    ok(type.accepts([1]));
    ok(!type.accepts(['invalid']));
    ok(!type.accepts({}));
  });

  it('returns a shallow frozen snapshot without freezing its caller', () => {
    const item = {};
    const input = [item];
    const output = t.ref('$ReadOnlyArray', t.any()).assert(input);
    notStrictEqual(input, output);
    strictEqual(output[0], item);
    ok(Object.isFrozen(output));
    ok(!Object.isFrozen(item));
    throws(() => output.push(item), TypeError);
    input.push(item);
    strictEqual(output.length, 1);
  });

  it('does not freeze arrays in warning mode', () => {
    const input = [1];
    strictEqual(t.warn(t.ref('$ReadOnlyArray', t.number()), input), input);
    ok(!Object.isFrozen(input));
  });
});
