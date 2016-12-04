/* @flow */
import {ok} from 'assert';

import JSONErrorReporter from '../JSONErrorReporter';
import t from '../../globalContext';

const no = (input: any): any => ok(!input);

describe('JSONErrorReporter', () => {
  it('should accept a valid value', () => {
    const type = t.string();
    const validation = t.validate(type, "hello world");
    const reporter = new JSONErrorReporter(validation);
    no(reporter.report());
  });

  it('should reject an invalid value', () => {
    const type = t.string();
    const validation = t.validate(type, false);
    const reporter = new JSONErrorReporter(validation);
    console.log(reporter.report());
  });

  describe('Objects', () => {
    const type = t.object({
      name: t.string(),
      address: {
        line1: t.string()
      }
    });

    it('should accept a valid value', () => {
      const validation = t.validate(type, {name: "foo", address: { line1: 'bar' }});
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, false);
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });

    it('should reject another invalid value', () => {
      const validation = t.validate(type, {name: false, address: {}});
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });

  describe('Arrays', () => {
    const type = t.array(t.number());

    it('should accept a valid value', () => {
      const validation = t.validate(type, [1, 2, 3]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [1, 2, "foo"]);
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });

  describe('Array<Object>', () => {
    const type = t.array(t.object({name: t.string()}));

    it('should accept a valid value', () => {
      const validation = t.validate(type, [{name: 'foo'}]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [{name: 'foo'}, {name: 123}]);
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });

  describe('Object<Array>', () => {
    const type = t.array(t.object({items: t.array(t.number())}));

    it('should accept a valid value', () => {
      const validation = t.validate(type, [{items: [1, 2, 3]}]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [{items: [1, 2, 3]}, {items: [1, 2, "foo"]}]);
      validation.inputName = 'input';
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });


  describe('(a: number, b: number) => number', () => {
    const type = t.fn(
      t.param('a', t.number()),
      t.param('b', t.number()),
      t.return(t.number())
    );

    const invalidType = t.fn(
      t.param('a', t.number()),
      t.return(t.number())
    );

    const valid = t.annotate(type)((a: number, b: number) => a + b);
    const invalid = t.annotate(invalidType)((a: number) => a * 2);

    it('should accept a valid value', () => {
      const validation = t.validate(type, valid);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, invalid);
      validation.inputName = 'input';
      const reporter = new JSONErrorReporter(validation);
      console.log('yp', reporter.report());
    });
  });
});