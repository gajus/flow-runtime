/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class VoidType extends Type {
  typeName: string = 'VoidType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (input !== undefined) {
      yield [path, getErrorMessage('ERR_EXPECT_VOID'), this];
    }
  }

  accepts (input: any): boolean {
    return input === undefined;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof VoidType) {
      return 0;
    }
    else {
      return -1;
    }
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
