/* @flow */

import Type from './Type';
import NumericLiteralType from './NumericLiteralType';

import type Validation, {IdentifierPath} from '../Validation';

export default class NumberType extends Type {
  typeName: string = 'NumberType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input === 'number') {
      return false;
    }
    else {
      validation.addError(path, this, 'ERR_EXPECT_NUMBER');
      return false;
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'number';
  }

  acceptsType (input: Type<any>): boolean {
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
