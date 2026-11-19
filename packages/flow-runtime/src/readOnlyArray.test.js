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

  it('retains a checked snapshot through delayed and declared aliases', () => {
    const type = t.type('ReadOnlyArraySnapshotTest', t.readOnlyArray(t.number()));
    const declaration = t.declare(type);
    for (const wrapper of [declaration, t.ref('ReadOnlyArraySnapshotTest'),
      t.box(() => type), t.tdz(() => type), t.return(type)]) {
      const input = [1];
      const output = wrapper.assert(input);
      ok(Object.isFrozen(output));
      notStrictEqual(input, output);
      ok(!Object.isFrozen(input));
    }
  });

  it('does not structurally unwrap a nominal intersection after validation', () => {
    class Item {
      constructor(value) {
        this.value = value;
      }
    }
    const type = t.type('ItemWithValue', t.intersection(t.ref(Item),
      t.object(t.property('value', t.number(1)))));
    const item = new Item(1);
    strictEqual(type.assert(item), item);
    strictEqual(t.assert(type, item), item);
    throws(() => type.assert(new Item(2)));
  });
});
