/* @flow */

import Type from './Type';

export default class ObjectTypeProperty extends Type {
  typeName: string = 'ObjectTypeProperty';
  key: string;
  value: Type;
  optional: boolean;

  accepts (input: Object): boolean {
    if (this.optional && input[this.key] === undefined) {
      return true;
    }
    return this.value.accepts(input[this.key]);
  }

  acceptsType (input: Type): boolean {
    if (!(input instanceof ObjectTypeProperty)) {
      return false;
    }
    return this.value.acceptsType(input.value);
  }

  makeErrorMessage (): string {
    return `Invalid value for property: ${this.key}.`;
  }

  toString (): string {
    return `${this.key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      key: this.key,
      value: this.value,
      optional: this.optional
    };
  }
}