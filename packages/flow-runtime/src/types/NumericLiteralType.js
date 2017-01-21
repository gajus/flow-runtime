/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class NumericLiteralType<T: number> extends Type {
  typeName: string = 'NumericLiteralType';
  value: T;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {value} = this;
    if (input === value) {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_EXACT_VALUE', value));
      return false;
    }
  }

  accepts (input: any): boolean {
    return input === this.value;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof NumericLiteralType && input.value === this.value) {
      return 0;
    }
    else {
      return -1;
    }
  }

  toString (): string {
    return `${this.value}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}