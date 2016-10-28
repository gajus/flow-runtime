/* @flow */

import Type from './Type';

export default class AnyType extends Type {
  typeName: string = 'AnyType';

  match (input: any): boolean {
    return true;
  }

  matchType (input: Type): boolean {
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