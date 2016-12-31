/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class ObjectTypeCallProperty<T: Function> extends Type {
  typeName: string = 'ObjectTypeCallProperty';
  value: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return this.value.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.value.accepts(input);
  }

  acceptsType (input: Type<any>): boolean {
    if (!(input instanceof ObjectTypeCallProperty)) {
      return false;
    }
    return this.value.acceptsType(input.value);
  }

  unwrap (): Type<T> {
    return this.value.unwrap();
  }


  toString (): string {
    return `${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}