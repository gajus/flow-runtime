/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';
import FunctionTypeRestParam from './FunctionTypeRestParam';

export default class FunctionTypeParam<T> extends Type {
  typeName: string = 'FunctionTypeParam';
  name: string;
  optional: boolean;
  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {optional, type} = this;
    if (optional && input === undefined) {
      return;
    }
    else {
      yield* type.errors(validation, path, input);
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
    if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
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