/* @flow */

import Type from './Type';
import NumericLiteralType from './NumericLiteralType';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class NumberType extends Type {
  typeName: string = 'NumberType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input === 'number') {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_NUMBER'));
      return false;
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'number';
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof NumberType || input instanceof NumericLiteralType;
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
