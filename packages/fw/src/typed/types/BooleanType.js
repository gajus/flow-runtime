/* @flow */

import Type from './Type';
import BooleanLiteralType from './BooleanLiteralType';

export default class BooleanType extends Type {
  typeName: string = 'BooleanType';

  match (input: any): boolean {
    return typeof input === 'boolean';
  }

  matchType (input: Type): boolean {
    return input instanceof BooleanType || input instanceof BooleanLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value must be true or false.';
  }

  toString () {
    return 'boolean';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}