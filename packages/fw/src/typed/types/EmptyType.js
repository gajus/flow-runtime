/* @flow */

import Type from './Type';

export default class EmptyType extends Type {
  typeName: string = 'EmptyType';

  match (input: any): boolean {
    return false; // empty types match nothing.
  }

  matchType (input: Type): boolean {
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