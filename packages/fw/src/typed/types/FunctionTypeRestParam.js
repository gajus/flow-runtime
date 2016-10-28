/* @flow */

import Type from './Type';

import FunctionTypeParam from './FunctionTypeParam';

export default class FunctionTypeRestParam extends Type {
  typeName: string = 'FunctionTypeRestParam';
  name: string;
  type: Type;

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  matchType (input: Type): boolean {
    if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
      return this.type.matchType(input.type);
    }
    else {
      return this.type.matchType(input);
    }
  }

  makeErrorMessage (): string {
    return `Invalid value for rest argument: ${this.name}.`;
  }

  toString (): string {
    const {type} = this;
    return `...${this.name}: ${type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}
