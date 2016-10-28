/* @flow */

import Type from './Type';

export default class ExistentialType extends Type {
  typeName: string = 'ExistentialType';

  accepts (input: any): boolean {
    return true;
  }

  acceptsType (input: Type): boolean {
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