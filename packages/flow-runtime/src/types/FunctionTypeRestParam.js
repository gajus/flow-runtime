/* @flow */

import Type from './Type';

import FunctionTypeParam from './FunctionTypeParam';

import type Validation, {IdentifierPath} from '../Validation';

export default class FunctionTypeRestParam<T> extends Type {
  typeName: string = 'FunctionTypeRestParam';
  name: string;
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    return type.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  acceptsType (input: Type<any>): boolean {
    if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
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
