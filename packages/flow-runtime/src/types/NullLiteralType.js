/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class NullLiteralType extends Type {
  typeName: string = 'NullLiteralType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === null) {
      return false;
    }
    validation.addError(path, this, getErrorMessage('ERR_EXPECT_NULL'));
    return true;
  }

  accepts (input: any): boolean {
    return input === null;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof NullLiteralType) {
      return 0;
    }
    else {
      return -1;
    }
  }

  toString (): string {
    return 'null';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
