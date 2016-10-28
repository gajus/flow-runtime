/* @flow */

import Type from './Type';

export default class NullLiteralType extends Type {
  typeName: string = 'NullLiteralType';

  match (input: any): boolean {
    return input === null;
  }

  matchType (input: Type): boolean {
    return input instanceof NullLiteralType;
  }

  makeErrorMessage (): string {
    return 'Value is not null.';
  }

  toString (): string {
    return 'null';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}
