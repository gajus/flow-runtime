/* @flow */
import {doesNotThrow, ok} from 'assert';

import t from './globalContext';

describe('Warn API', () => {
  it('should emit a warning instead of throwing when validation internals throw', () => {
    const shapeOfString = t.$shape(t.string());
    const messages = [];

    const emitWarningMessage = t.emitWarningMessage;
    t.emitWarningMessage = (message: string) => {
      messages.push(message);
    };

    try {
      doesNotThrow(() => t.warn(shapeOfString, {name: 'Alice'}));
    }
    finally {
      t.emitWarningMessage = emitWarningMessage;
    }

    ok(messages.length > 0);
    ok(/Can only \$Shape<T> object types\./.test(messages[0]));
  });
});
