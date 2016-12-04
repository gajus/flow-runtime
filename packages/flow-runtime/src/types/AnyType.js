/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class AnyType extends Type {
  typeName: string = 'AnyType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return false;
  }

  accepts (input: any): boolean {
    return true;
  }

  acceptsType (input: Type<any>): boolean {
    return true;
  }

  toString (): string {
    return 'any';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}