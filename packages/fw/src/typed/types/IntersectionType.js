/* @flow */

import Type from './Type';

export default class IntersectionType extends Type {
  typeName: string = 'IntersectionType';
  types: Type[] = [];

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.accepts(input)) {
        return false;
      }
    }
    return true;
  }

  acceptsType (input: Type): boolean {
    const types = this.types;
    if (input instanceof IntersectionType) {
      const inputTypes = input.types;
      loop: for (let i = 0; i < types.length; i++) {
        const type = types[i];
        for (let j = 0; j < inputTypes.length; j++) {
          if (type.acceptsType(inputTypes[i])) {
            continue loop;
          }
        }
        // if we got this far then nothing acceptsed this type.
        return false;
      }
      return true;
    }
    else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (!type.acceptsType(input)) {
          return false;
        }
      }
      return true;
    }
  }

  makeErrorMessage (): string {
    return 'Invalid intersection element.';
  }

  toString (): string {
    return this.types.join(' & ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}