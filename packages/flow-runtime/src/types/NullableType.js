/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class NullableType<T> extends Type {
  typeName: string = 'NullableType';
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === null) {
      return false;
    }
    else {
      return this.type.collectErrors(validation, path, input);
    }
  }

  accepts (input: any): boolean {
    if (input == null) {
      return true;
    }
    else {
      return this.type.accepts(input);
    }
  }

  acceptsType (input: Type<any>): boolean {
    if (input instanceof NullableType) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this.type.unwrap();
  }

  toString (): string {
    return `? ${this.type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}
