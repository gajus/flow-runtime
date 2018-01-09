/* @flow */
import {ok, equal} from 'assert';

import makeTypeError from '../makeTypeError';
import t from '../../globalContext';

const no = (input: any): any => ok(!input);

describe('makeTypeError', () => {
  it('should accept a valid value', () => {
    const type = t.string();
    const validation = t.validate(type, "hello world");
    const report = makeTypeError(validation);
    no(report);
  });

  it('should reject an invalid value', () => {
    const type = t.string();
    const validation = t.validate(type, false);
    const report = makeTypeError(validation);
    const err = report;
    ok(err instanceof TypeError);
  });

  it('should attach the validation errors to Error', () => {
    const type = t.string();
    const validation = t.validate(type, false);
    const report = makeTypeError(validation);
    const err = report;
    equal(err.errors, validation.errors);
  });

  describe('Objects', () => {
    const type = t.object({
      name: t.string(),
      address: {
        line1: t.union(t.string(), t.number())
      }
    });

    it('should accept a valid value', () => {
      const validation = t.validate(type, {name: "foo", address: { line1: 'bar' }});
      const report = makeTypeError(validation);
      no(report);
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, false);
      const report = makeTypeError(validation);
      const err = report;
      ok(err instanceof TypeError);
    });

    it('should reject another invalid value', () => {
      const validation = t.validate(type, {name: false, address: {}});
      const report = makeTypeError(validation);
      const err = report;
      ok(err instanceof TypeError);
    });
  });
});