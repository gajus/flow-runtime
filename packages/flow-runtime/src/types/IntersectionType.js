/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class IntersectionType<T> extends Type {
  typeName: string = 'IntersectionType';
  types: Type<T>[] = [];

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {types} = this;
    const {length} = types;
    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.collectErrors(validation, path, input)) {
        hasErrors = true;
      }
    }
    return hasErrors;
  }

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

  acceptsType (input: Type<any>): boolean {
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
        // if we got this far then nothing accepted this type.
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