/* @flow */
import {equal, ok} from 'assert';

import t from './globalContext';

describe('TypeContext', () => {
  describe('warn()', () => {
    it('should emit validation exceptions as warnings', () => {
      const context = t.createContext();
      const input = {};
      const messages = [];

      context.emitWarningMessage = (message: string) => {
        messages.push(message);
      };

      equal(context.warn(context.$shape(context.string()), input), input);
      equal(messages.length, 1);
      ok(/Can only \$Shape<T> object types\./.test(messages[0]));
    });
  });
});
