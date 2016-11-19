/* @flow */

import Type from './Type';
import StringLiteralType from './StringLiteralType';

export default class StringType extends Type {
  typeName: string = 'StringType';

  accepts (input: any): boolean {
    return typeof input === 'string';
  }

  acceptsType (input: Type): boolean {
    return input instanceof StringType || input instanceof StringLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value must be a string.';
  }

  toString () {
    return 'string';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

