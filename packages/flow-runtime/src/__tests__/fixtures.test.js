/* @flow */

import {ok, throws} from 'assert';

import fixtures from './fixtures';

import t from '../globalContext';

describe('fixtures', () => {
  for (const [name, {pass, fail}] of fixtures) {
    const context = t.createContext();
    if (pass) {
      it(`fixture: ${name} should pass`, () => {
        ok(pass(context));
      });
    }
    if (fail) {
      it(`fixture: ${name} should fail`, () => {
        throws(() => fail(context));
      });
    }
  }
});
