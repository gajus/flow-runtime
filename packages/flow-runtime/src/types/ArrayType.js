/* @flow */

import Type from './Type';
import TupleType from './TupleType';
import compareTypes from '../compareTypes';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

import {
  inValidationCycle,
  startValidationCycle,
  endValidationCycle,
  inToStringCycle,
  startToStringCycle,
  endToStringCycle
} from '../cyclic';

export default class ArrayType <T> extends Type {
  typeName: string = 'ArrayType';
  elementType: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {context} = this;
    if (!context.checkPredicate('Array', input)) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_ARRAY'));
      return true;
    }
    if (inValidationCycle(this, input)) {
      return false;
    }
    startValidationCycle(this, input);
    const {elementType} = this;
    const {length} = input;

    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      if (elementType.collectErrors(validation, path.concat(i), input[i])) {
        hasErrors = true;
      }
    }
    endValidationCycle(this, input);
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {context} = this;
    if (!context.checkPredicate('Array', input)) {
      return false;
    }
    if (inValidationCycle(this, input)) {
      return true;
    }
    startValidationCycle(this, input);
    const {elementType} = this;
    const {length} = input;
    for (let i = 0; i < length; i++) {
      if (!elementType.accepts(input[i])) {
        endValidationCycle(this, input);
        return false;
      }
    }
    endValidationCycle(this, input);
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {elementType} = this;
    if (input instanceof TupleType) {
      const {types} = input;
      for (let i = 0; i < types.length; i++) {
        const result = compareTypes(elementType, types[i]);
        if (result === -1) {
          return -1;
        }
      }
      return 1;
    }
    else if (input instanceof ArrayType) {
      return compareTypes(elementType, input.elementType);
    }
    else {
      return -1;
    }
  }

  toString (): string {
    const {elementType} = this;
    if (inToStringCycle(this)) {
      if (typeof elementType.name === 'string') {
        return `Array<$Cycle<${elementType.name}>>`;
      }
      else {
        return `Array<$Cycle<Object>>`;
      }
    }
    startToStringCycle(this);
    const output = `Array<${elementType.toString()}>`;
    endToStringCycle(this);
    return output;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      elementType: this.elementType
    };
  }
}
