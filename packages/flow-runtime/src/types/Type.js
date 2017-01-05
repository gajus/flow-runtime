/* @flow */

import makeError from '../makeError';

import type TypeContext from '../TypeContext';

import type Validation, {IdentifierPath} from '../Validation';


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
    const error = makeError(this, input);
    if (error) {
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(error, this.assert);
      }
      throw error;
    }
    return input;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
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