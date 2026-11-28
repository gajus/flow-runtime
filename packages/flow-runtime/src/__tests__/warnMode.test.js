/* @flow */
import {equal, ok} from 'assert';

import t from '../globalContext';

describe('warn mode', () => {
  function collectWarnings (run) {
    const original = t.emitWarningMessage;
    const messages = [];
    t.emitWarningMessage = (message) => {
      messages.push(message);
    };
    try {
      run();
    }
    finally {
      t.emitWarningMessage = original;
    }
    return messages;
  }

  it('warns instead of throwing for invalid input', () => {
    const messages = collectWarnings(() => {
      t.warn(t.string(), 123);
    });
    ok(messages.length > 0, 'expected a warning message');
  });

  it('does not throw when a type invariant throws during validation', () => {
    // `$Shape` of a non-object type hits a hard invariant inside
    // `$ShapeType.errors()`; in warn mode this must become a warning.
    const shape = t.$shape(t.number());
    let returned;
    const messages = collectWarnings(() => {
      returned = t.warn(shape, {a: 1});
    });
    equal(returned !== undefined, true);
    ok(messages.length > 0, 'expected invariant error to be emitted as warning');
    ok(/Can only \$Shape/.test(messages[0]), 'expected invariant message, got: ' + messages[0]);
  });

  it('check() uses warn mode when the context mode is warn', () => {
    const context = t.createContext();
    context.mode = 'warn';
    const shape = context.$shape(context.number());
    const original = context.emitWarningMessage;
    const messages = [];
    context.emitWarningMessage = (message) => {
      messages.push(message);
    };
    try {
      context.check(shape, {a: 1});
    }
    finally {
      context.emitWarningMessage = original;
    }
    ok(messages.length > 0, 'expected invariant error to be emitted as warning');
  });
});
