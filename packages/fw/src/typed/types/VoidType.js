/* @flow */

import Type from './Type';


export default class VoidType extends Type {
  typeName: string = 'VoidType';

  match (input: any): boolean {
    return input === undefined;
  }

  matchType (input: Type): boolean {
    return input instanceof VoidType;
  }

  makeErrorMessage (): string {
    return 'Value must be undefined.';
  }

  toString (): string {
    return 'void';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
