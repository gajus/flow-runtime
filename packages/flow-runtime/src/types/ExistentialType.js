/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';


export default class ExistentialType extends Type {
  typeName: string = 'ExistentialType';

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
    return '*';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}