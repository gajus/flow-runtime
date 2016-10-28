/* @flow */

import Type from './Type';

export default class UnionType extends Type {
  typeName: string = 'UnionType';
  types: Type[] = [];

  match (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.match(input)) {
        return true;
      }
    }
    return false;
  }

  matchType (input: Type): boolean {
    const types = this.types;
    if (input instanceof UnionType) {
      const inputTypes = input.types;
      loop: for (let i = 0; i < types.length; i++) {
        const type = types[i];
        for (let j = 0; j < inputTypes.length; j++) {
          if (type.matchType(inputTypes[i])) {
            continue loop;
          }
        }
        // if we got this far then nothing matched this type.
        return false;
      }
      return true;
    }
    else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type.matchType(input)) {
          return true;
        }
      }
      return false;
    }
  }

  makeErrorMessage (): string {
    return 'Invalid union element.';
  }

  toString (): string {
    return this.types.join(' | ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}