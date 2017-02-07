/* @flow */

import Type from './Type';
import NumericLiteralType from './NumericLiteralType';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class NumberType extends Type {
  typeName: string = 'NumberType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'number') {
      yield [path, getErrorMessage('ERR_EXPECT_NUMBER'), this];
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'number';
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof NumberType) {
      return 0;
    }
    else if (input instanceof NumericLiteralType) {
      return 1;
    }
    else {
      return -1;
    }
  }

  toString (): string {
    return 'number';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
