/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class NullLiteralType extends Type {
  typeName: string = 'NullLiteralType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === null) {
      return false;
    }
    validation.addError(path, 'ERR_EXPECT_NULL');
    return true;
  }

  accepts (input: any): boolean {
    return input === null;
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof NullLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value is not null.';
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
