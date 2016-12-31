/* @flow */

import Type from './Type';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';


export default class ArrayType <T> extends Type {
  typeName: string = 'ArrayType';
  elementType: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (!Array.isArray(input)) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_ARRAY'));
      return true;
    }
    const {elementType} = this;
    const {length} = input;

    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      if (elementType.collectErrors(validation, path.concat(i), input[i])) {
        hasErrors = true;
      }
    }
    return hasErrors;
  }

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

  acceptsType (input: Type<any>): boolean {
    return input instanceof ArrayType && this.elementType.acceptsType(input.elementType);
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
