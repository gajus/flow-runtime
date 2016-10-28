/* @flow */

import Type from './Type';

export default class BooleanLiteralType extends Type {
  typeName: string = 'BooleanLiteralType';
  value: boolean;

  match (input: any): boolean {
    return input === this.value;
  }

  matchType (input: Type): boolean {
    return input instanceof BooleanLiteralType && input.value === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return this.value ? 'true' : 'false';
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}