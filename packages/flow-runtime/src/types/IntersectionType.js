/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

import type {Property} from './ObjectType';

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


  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty <K: string | number> (key: K): ? Property<K, any> {
    const {types} = this;
    const {length} = types;
    for (let i = length - 1; i >= 0; i--) {
      const type = types[i];
      if (typeof type.getProperty === 'function') {
        const prop = type.getProperty(key);
        if (prop) {
          return prop;
        }
      }
    }
  }

  /**
   * Determine whether a property with the given name exists.
   */
  hasProperty (key: string): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (typeof type.hasProperty === 'function' && type.hasProperty(key)) {
        return true;
      }
    }
    return false;
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