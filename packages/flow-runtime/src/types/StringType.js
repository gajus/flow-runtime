/* @flow */

import Type from './Type';
import StringLiteralType from './StringLiteralType';
import type Validation, {IdentifierPath} from '../Validation';

export default class StringType extends Type {
  typeName: string = 'StringType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input === 'string') {
      return false;
    }
    else {
      validation.addError(path, this, 'ERR_EXPECT_STRING');
      return true;
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'string';
  }

  acceptsType (input: Type<any>): boolean {
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

