/* @flow */
import {ok, throws} from 'assert';

import t from './globalContext';

describe('Type Constraints', () => {

  describe('TypeAlias TypeConstraints', () => {

    const EmailAddress = t.type('EmailAddress', t.string());

    it('should constrain a type', () => {
      EmailAddress.addConstraint(
        (input: string): ? string => {
          if (input.length < 4) {
            return 'too short, cannot be a valid email address.';
          }
        },
        (input: string): ? string => {
          if (!/@/.test(input)) {
            return 'not a valid email address';
          }
        }
      );
    });

    it('should accept valid input', () => {
      ok(EmailAddress.assert("foo@example.com"));
    });

    it('should reject invalid input: null', () => {
      throws(() => EmailAddress.assert(null));
    });

    it('should reject invalid input: n@n', () => {
      throws(() => EmailAddress.assert('n@n'));
    });

    it('should reject invalid input: foo', () => {
      throws(() => EmailAddress.assert('foo'));
    });

    it('should reject invalid input: [1, 2, 3]', () => {
      throws(() => EmailAddress.assert([1, 2, 3]));
    });
  });

  describe('ObjectTypeProperty Constraints', () => {

    const User = t.type('User', t.object({
      username: t.string()
    }));

    User.getProperty('username').addConstraint((input: string) => {
      if (!/^([A-Z][A-Z0-9]*)$/i.test(input)) {
        return 'must be alphanumeric and start with a letter, no spaces.';
      }
    });

    it('should accept valid input', () => {
      User.assert({
        username: 'fine'
      });
    });

    it('should reject invalid input', () => {
      throws(() => User.assert({
        username: false
      }));
    });


    it('should reject more invalid input', () => {
      throws(() => User.assert({
        username: 'not fine'
      }));
    });
  });
});