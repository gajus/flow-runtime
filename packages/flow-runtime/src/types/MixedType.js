/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class MixedType extends Type {
  typeName: string = 'MixedType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return false;
  }

  accepts (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'mixed';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}