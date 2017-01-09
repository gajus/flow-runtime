/* @flow */

import t from 'flow-runtime';
import * as mobx from 'mobx';
import flowRuntimeMobx from './';

const {ObservableMap} = mobx;

import {throws} from 'assert';

describe('registerMobxTypes', () => {


  const ThingType = t.object({
    numbers: t.array(t.number()),
    map: t.ref(Map, t.string(), t.string())
  });

  const thing = mobx.observable({
    numbers: [1, 2, 3],
    map: new ObservableMap({foo: 'bar'})
  });

  const other = mobx.observable({
    numbers: [false, true],
    map: new ObservableMap({foo: 123})
  });

  it('should not accept observable arrays and maps before registration', () => {
    throws(() => {
      ThingType.assert(thing);
    });
  });

  it('should register the mobx types', () => {
    flowRuntimeMobx(t, mobx);
  });

  it('should now accept observable arrays and maps', () => {
    ThingType.assert(thing);
  });

  it('should fail on invalid values', () => {
    throws(() => {
      ThingType.assert(other);
    });
  });
});