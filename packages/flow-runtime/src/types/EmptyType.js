/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class EmptyType extends Type {
  typeName: string = 'EmptyType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield [path, getErrorMessage('ERR_EXPECT_EMPTY'), this];
  }

  accepts (input: any): boolean {
    return false; // empty types accepts nothing.
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof EmptyType) {
      return 0;
    }
    else {
      return -1;
    }
  }

  toString (): string {
    return 'empty';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}