/* @flow */

import t from 'flow-runtime';
import {validators, compose} from './';

import {equal, throws} from 'assert';

function pass (validate: Function, input: any) {
  it(`should accept ${JSON.stringify(input)}`, () => {
    equal(validate(input), undefined);
  });
}

function fail (validate: Function, input: any) {
  it(`should not accept ${JSON.stringify(input)}`, () => {
    equal(typeof validate(input), "string");
  });
}

describe('Compose', () => {
  const validate = compose(
    validators.length({min: 10, max: 250}),
    validators.email()
  );

  fail(validate, 'a@b.com');
  fail(validate, 'this is not valid');
  pass(validate, 'person@example.com');

  it('should addConstraint', () => {
    const email = t.type('email', t.string());
    email.addConstraint(validate);

    email.assert("person@example.com");
    throws(() => email.assert("nope"));
  });
});

describe('Common Validators', () => {
  describe('length', () => {
    describe('min only', () => {
      const validate = validators.length({min: 3});

      fail(validate, null);
      fail(validate, false);

      pass(validate, "yes");
      fail(validate, "no");

      pass(validate, [1, 2, 3]);
      fail(validate, []);
    });
    describe('max only', () => {
      const validate = validators.length({max: 8});

      fail(validate, null);
      fail(validate, false);

      pass(validate, "yes");
      pass(validate, "no");
      fail(validate, "nope this is too long");

      pass(validate, [1, 2, 3]);
      pass(validate, []);
      fail(validate, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    describe('exact', () => {
      const validate = validators.length({exact: 3});

      pass(validate, "yes");
      fail(validate, "no");
      fail(validate, "nope this is too long");

      pass(validate, [1, 2, 3]);
      fail(validate, [1, 2]);
      fail(validate, [1, 2, 3, 4]);
    });
    describe('min and max', () => {
      const validate = validators.length({min: 3, max: 8});

      pass(validate, "yes");
      fail(validate, "no");
      fail(validate, "nope this is too long");

      pass(validate, [1, 2, 3]);
      fail(validate, []);
      fail(validate, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('number', () => {
    describe('exact', () => {
      const validate = validators.number({exact: 123});
      pass(validate, 123);
      fail(validate, 122);
      fail(validate, 124);
    });

    describe('gt', () => {
      const validate = validators.number({gt: 2});
      pass(validate, 123);
      fail(validate, 0);
      fail(validate, 2);
    });

    describe('gte', () => {
      const validate = validators.number({gte: 2});
      pass(validate, 123);
      pass(validate, 2);
      fail(validate, 1);
      fail(validate, 0);
    });
    describe('lt', () => {
      const validate = validators.number({lt: 2});
      pass(validate, 1);
      fail(validate, 100);
      fail(validate, 2);
    });

    describe('lte', () => {
      const validate = validators.number({lte: 2});
      pass(validate, 1);
      pass(validate, 2);
      fail(validate, 3);
      fail(validate, 10);
    });

    describe('divisibleBy', () => {
      const validate = validators.number({divisibleBy: 2});
      pass(validate, 2);
      pass(validate, 4);
      pass(validate, 6);
      pass(validate, 8);
      fail(validate, 3);
      fail(validate, 4.5);
      fail(validate, 9);
    });

    describe('integer', () => {
      const validate = validators.number({integer: true});
      pass(validate, 0);
      pass(validate, 123);
      fail(validate, 1.2);
      fail(validate, 2.33);
    });
  });

  describe('regexp', () => {
    describe('from string', () => {
      const validate = validators.regexp({pattern: 'abc'});
      pass(validate, "zzz abc fff");
      fail(validate, "nope");
      fail(validate, "a b c");
    });
    describe('from regexp', () => {
      const validate = validators.regexp({pattern: /abc/});
      pass(validate, "zzz abc fff");
      fail(validate, "nope");
      fail(validate, "a b c");
    });
  });

  describe('email', () => {
    const validate = validators.email();
    pass(validate, 'foo@bar.com');
    fail(validate, 'nope');
  });
});