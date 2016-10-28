/* @flow */

import Type from './Type';

export default class ExistentialType extends Type {
  typeName: string = 'ExistentialType';

  match (input: any): boolean {
    return true;
  }

  matchType (input: Type): boolean {
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