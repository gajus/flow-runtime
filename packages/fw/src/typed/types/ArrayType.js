/* @flow */

import Type from './Type';

export default class ArrayType extends Type {
  typeName: string = 'ArrayType';
  elementType: Type;

  accepts (input: any): boolean {
    if (!Array.isArray(input)) {
      return false;
    }
    const {elementType} = this;
    const {length} = input;
    for (let i = 0; i < length; i++) {
      if (!elementType.accepts(input[i])) {
        return false;
      }
    }
    return true;
  }

  acceptsType (input: Type): boolean {
    return input instanceof ArrayType && this.elementType.acceptsType(input.elementType);
  }

  makeErrorMessage (): string {
    return 'Invalid array.';
  }

  toString (): string {
    return `Array<${this.elementType.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      elementType: this.elementType
    };
  }
}
