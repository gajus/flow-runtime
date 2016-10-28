/* @flow */

import Type from './Type';

export default class NumericLiteralType extends Type {
  typeName: string = 'NumericLiteralType';
  value: number;

  accepts (input: any): boolean {
    return input === this.value;
  }

  acceptsType (input: Type): boolean {
    return input instanceof NumericLiteralType && input.value === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return `${this.value}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}