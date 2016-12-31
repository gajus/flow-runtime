/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class BooleanLiteralType <T: boolean> extends Type {
  typeName: string = 'BooleanLiteralType';
  value: T;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input !== this.value) {
      validation.addError(path, this, getErrorMessage(this.value ? 'ERR_EXPECT_TRUE' : 'ERR_EXPECT_FALSE'));
      return true;
    }
    return false;
  }

  accepts (input: any): boolean {
    return input === this.value;
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof BooleanLiteralType && input.value === this.value;
  }

  toString (): string {
    return this.value ? 'true' : 'false';
  }

  toJSON () {
    return {
      type: this.typeName,
      value: this.value
    };
  }
}