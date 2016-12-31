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

  acceptsType (input: Type<any>): boolean {
    return input instanceof NullLiteralType;
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
