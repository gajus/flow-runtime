/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class EmptyType extends Type {
  typeName: string = 'EmptyType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    validation.addError(path, this, 'ERR_EXPECT_EMPTY');
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