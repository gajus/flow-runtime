/* @flow */
import {ok} from 'assert';

import TypeErrorReporter from '../TypeErrorReporter';
import t from '../../globalContext';

const no = (input: any): any => ok(!input);

describe('TypeErrorReporter', () => {
  it('should accept a valid value', () => {
    const type = t.string();
    const validation = t.validate(type, "hello world");
    const reporter = new TypeErrorReporter(validation);
    no(reporter.report());
  });

  it('should reject an invalid value', () => {
    const type = t.string();
    const validation = t.validate(type, false);
    const reporter = new TypeErrorReporter(validation);
    console.log(reporter.report());
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
      const reporter = new TypeErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, false);
      const reporter = new TypeErrorReporter(validation);
      console.log('yp', reporter.report());
    });

    it('should reject another invalid value', () => {
      const validation = t.validate(type, {name: false, address: {}});
      const reporter = new TypeErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });
});