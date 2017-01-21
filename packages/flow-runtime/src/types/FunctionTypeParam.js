/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import type Validation, {IdentifierPath} from '../Validation';

export default class FunctionTypeParam<T> extends Type {
  typeName: string = 'FunctionTypeParam';
  name: string;
  optional: boolean;
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {optional, type} = this;
    if (optional && input === undefined) {
      return false;
    }
    else {
      return type.collectErrors(validation, path, input);
    }
  }

  accepts (input: any): boolean {
    const {optional, type} = this;
    if (optional && input === undefined) {
      return true;
    }
    else {
      return type.accepts(input);
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof FunctionTypeParam) {
      return compareTypes(this.type, input.type);
    }
    else {
      return compareTypes(this.type, input);
    }
  }

  toString (): string {
    const {optional, type} = this;
    return `${this.name}${optional ? '?' : ''}: ${type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      optional: this.optional,
      type: this.type
    };
  }
}