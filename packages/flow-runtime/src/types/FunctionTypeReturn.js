/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class FunctionTypeReturn<T> extends Type {
  typeName: string = 'FunctionTypeReturn';
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    return type.collectErrors(validation, path.concat('[[Return]]'), input);
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  acceptsType (input: Type<any>): boolean {
    if (input instanceof FunctionTypeReturn) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
  }

  unwrap (): Type<T> {
    return this.type;
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
