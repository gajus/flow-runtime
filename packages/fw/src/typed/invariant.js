/* @flow */

export default function invariant (input: any, message: string): void {
  if (!input) {
    const error = new Error(message);
    error.name = 'InvariantViolation';
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(error, invariant);
    }
    throw error;
  }
}