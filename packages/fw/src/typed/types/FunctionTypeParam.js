/* @flow */

import Type from './Type';

export default class FunctionTypeParam extends Type {
  typeName: string = 'FunctionTypeParam';
  name: string;
  optional: boolean;
  type: Type;

  match (input: any): boolean {
    const {optional, type} = this;
    if (optional && input === undefined) {
      return true;
    }
    else {
      return type.match(input);
    }
  }

  matchType (input: Type): boolean {
    if (input instanceof FunctionTypeParam) {
      return this.type.matchType(input.type);
    }
    else {
      return this.type.matchType(input);
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