/* @flow */

import Type from './Type';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class StringLiteralType<T: string> extends Type {
  typeName: string = 'StringLiteralType';
  value: T;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {value} = this;
    if (input === value) {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_EXACT_VALUE', this.toString()));
      return true;
    }
  }

  accepts (input: any): boolean {
    return input === this.value;
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof StringLiteralType && input.value === this.value;
  }

  toString (): string {
    return JSON.stringify(this.value);
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}