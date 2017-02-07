/* @flow */

import Type from './Type';
import BooleanLiteralType from './BooleanLiteralType';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class BooleanType extends Type {
  typeName: string = 'BooleanType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'boolean') {
      yield [path, getErrorMessage('ERR_EXPECT_BOOLEAN'), this];
    }
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