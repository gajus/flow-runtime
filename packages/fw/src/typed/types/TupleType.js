/* @flow */

import Type from './Type';

export default class TupleType extends Type {
  typeName: string = 'TupleType';
  types: Type[] = [];

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    if (!Array.isArray(input) || input.length < length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.accepts(input[i])) {
        return false;
      }
    }
    return true;
  }

  acceptsType (input: Type): boolean {
    if (!(input instanceof TupleType)) {
      return false;
    }
    const types = this.types;
    const inputTypes = input.types;
    if (inputTypes.length < types.length) {
      return false;
    }
    for (let i = 0; i < types.length; i++) {
      if (!types[i].acceptsType(inputTypes[i])) {
        return false;
      }
    }
    return true;
  }

  makeErrorMessage (): string {
    return 'Invalid tuple.';
  }

  toString (): string {
    return `[${this.types.join(', ')}]`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}