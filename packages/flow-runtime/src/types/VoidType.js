/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class VoidType extends Type {
  typeName: string = 'VoidType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === undefined) {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_VOID'));
      return true;
    }
  }

  accepts (input: any): boolean {
    return input === undefined;
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof VoidType;
  }

  toString (): string {
    return 'void';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
