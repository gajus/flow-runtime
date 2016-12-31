/* @flow */

import Type from './Type';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class UnionType<T> extends Type {
  typeName: string = 'UnionType';
  types: Type<T>[] = [];

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.accepts(input)) {
        return false;
      }
    }
    validation.addError(path, this, getErrorMessage('ERR_NO_UNION', this.toString()));
    return true;
  }

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.accepts(input)) {
        return true;
      }
    }
    return false;
  }

  acceptsType (input: Type<any>): boolean {
    const types = this.types;
    if (input instanceof UnionType) {
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
        if (type.acceptsType(input)) {
          return true;
        }
      }
      return false;
    }
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