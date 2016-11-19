/* @flow */

import Type from './Type';

export default class FunctionTypeReturn extends Type {
  typeName: string = 'FunctionTypeReturn';
  type: Type;

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  acceptsType (input: Type): boolean {
    if (input instanceof FunctionTypeReturn) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
  }

  makeErrorMessage (): string {
    return 'Invalid function return type.';
  }

  toString (): string {
    const {type} = this;
    return type.toString();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}
