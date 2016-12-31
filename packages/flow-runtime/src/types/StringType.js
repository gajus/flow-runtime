/* @flow */

import Type from './Type';
import StringLiteralType from './StringLiteralType';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class StringType extends Type {
  typeName: string = 'StringType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input === 'string') {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_STRING'));
      return true;
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'string';
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof StringType || input instanceof StringLiteralType;
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

