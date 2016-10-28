/* @flow */

import Type from './Type';

export default class StringLiteralType extends Type {
  typeName: string = 'StringLiteralType';
  value: string;

  match (input: any): boolean {
    return input === this.value;
  }

  matchType (input: Type): boolean {
    return input instanceof StringLiteralType && input.value === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return JSON.stringify(this.value);
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}