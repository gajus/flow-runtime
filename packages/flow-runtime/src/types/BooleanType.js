/* @flow */

import Type from './Type';
import BooleanLiteralType from './BooleanLiteralType';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class BooleanType extends Type {
  typeName: string = 'BooleanType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input !== 'boolean') {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_BOOLEAN'));
      return true;
    }
    return false;
  }

  accepts (input: any): boolean {
    return typeof input === 'boolean';
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof BooleanLiteralType) {
      return 1;
    }
    else if (input instanceof BooleanType) {
      return 0;
    }
    else {
      return -1;
    }
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