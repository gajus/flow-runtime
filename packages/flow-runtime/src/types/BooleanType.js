/* @flow */

import Type from './Type';
import BooleanLiteralType from './BooleanLiteralType';

import type Validation, {IdentifierPath} from '../Validation';

export default class BooleanType extends Type {
  typeName: string = 'BooleanType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input !== 'boolean') {
      validation.addError(path, 'ERR_EXPECT_BOOLEAN');
      return true;
    }
    return false;
  }

  accepts (input: any): boolean {
    return typeof input === 'boolean';
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof BooleanType || input instanceof BooleanLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value must be true or false.';
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