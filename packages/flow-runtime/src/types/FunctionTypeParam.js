/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class FunctionTypeParam<T> extends Type {
  typeName: string = 'FunctionTypeParam';
  name: string;
  optional: boolean;
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {optional, name, type} = this;
    if (optional && input === undefined) {
      return false;
    }
    else {
      return type.collectErrors(validation, path.concat(name), input);
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

  acceptsType (input: Type<any>): boolean {
    if (input instanceof FunctionTypeParam) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
  }

  makeErrorMessage (): string {
    return `Invalid value for ${this.optional ? 'optional ' : ''}argument: ${this.name}.`;
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