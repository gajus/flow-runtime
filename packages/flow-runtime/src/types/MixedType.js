/* @flow */

import Type from './Type';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class MixedType extends Type {
  typeName: string = 'MixedType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
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