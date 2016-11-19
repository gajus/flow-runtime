/* @flow */

import Type from './Type';

export default class AnyType extends Type {
  typeName: string = 'AnyType';

  accepts (input: any): boolean {
    return true;
  }

  acceptsType (input: Type): boolean {
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