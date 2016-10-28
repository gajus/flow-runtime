/* @flow */

import Type from './Type';

export default class MixedType extends Type {
  typeName: string = 'MixedType';

  match (input: any): boolean {
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