/* @flow */

import makeError from '../makeError';

import type TypeContext from '../TypeContext';

import type {Constructor} from './';

/**
 * # Type
 *
 * This is the base class for all types.
 */
export default class Type {
  typeName: string = 'Type';
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

  match (input: any): boolean {
    throw new Error('Not implemented.');
  }

  matchType (input: Type): boolean {
    throw new Error('Not implemented.');
  }

  assert <T> (input: T): T {
    if (!this.match(input)) {
      throw makeError(this, input);
    }
    return input;
  }

  makeErrorMessage (): string {
    return 'Invalid value for type.';
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this;
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
