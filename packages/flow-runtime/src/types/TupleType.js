/* @flow */

import Type from './Type';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class TupleType<T> extends Type {
  typeName: string = 'TupleType';
  types: Type<T>[] = [];

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {types} = this;
    const {length} = types;
    const {context} = this;
    if (!context.checkPredicate('Array', input)) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_ARRAY'));
      return true;
    }
    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.collectErrors(validation, path.concat(i), input[i])) {
        hasErrors = true;
      }
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    const {context} = this;

    if (!context.checkPredicate('Array', input) || input.length < length) {
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

  acceptsType (input: Type<any>): boolean {
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