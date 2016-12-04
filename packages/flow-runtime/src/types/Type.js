/* @flow */

import makeError from '../makeError';

import type TypeContext from '../TypeContext';

import type Validation, {IdentifierPath} from '../Validation';

import type {Constructor} from './';

/**
 * # Type
 *
 * This is the base class for all types.
 */
export default class Type <T> {
  typeName: string = 'Type';
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return false;
  }

  accepts (input: any): boolean {
    throw new Error('Not implemented.');
  }

  acceptsType (input: Type<any>): boolean {
    throw new Error('Not implemented.');
  }

  assert (input: T): T {
    if (!this.accepts(input)) {
      const error = makeError(this, input);
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(error, this.assert);
      }
      throw error;
    }
    return input;
  }

  makeErrorMessage (): string {
    return 'Invalid value for type.';
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type<T> | Constructor {
    return this;
  }

  // @flowIssue 252
  [Symbol.hasInstance] (input: any) {
    return this.accepts(input);
  }

  toString () {
    throw new Error('Not implemented.');
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}