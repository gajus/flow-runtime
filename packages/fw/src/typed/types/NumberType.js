/* @flow */

import Type from './Type';
import NumericLiteralType from './NumericLiteralType';

export default class NumberType extends Type {
  typeName: string = 'NumberType';

  match (input: any): boolean {
    return typeof input === 'number';
  }

  matchType (input: Type): boolean {
    return input instanceof NumberType || input instanceof NumericLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value is not a number.';
  }

  toString (): string {
    return 'number';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
