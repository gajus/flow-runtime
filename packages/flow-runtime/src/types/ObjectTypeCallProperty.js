/* @flow */

import Type from './Type';

export default class ObjectTypeCallProperty extends Type {
  typeName: string = 'ObjectTypeCallProperty';
  value: Type;

  accepts (input: any): boolean {
    return this.value.accepts(input);
  }

  acceptsType (input: Type): boolean {
    if (!(input instanceof ObjectTypeCallProperty)) {
      return false;
    }
    return this.value.acceptsType(input.value);
  }

  makeErrorMessage (): string {
    return 'Invalid object call property.';
  }

  toString (): string {
    return `${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}