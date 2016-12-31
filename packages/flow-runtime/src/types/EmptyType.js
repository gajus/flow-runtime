/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class EmptyType extends Type {
  typeName: string = 'EmptyType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    validation.addError(path, this, getErrorMessage('ERR_EXPECT_EMPTY'));
    return true;
  }

  accepts (input: any): boolean {
    return false; // empty types accepts nothing.
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof EmptyType;
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