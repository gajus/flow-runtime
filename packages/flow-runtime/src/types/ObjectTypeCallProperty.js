/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class ObjectTypeCallProperty<T: Function> extends Type {
  typeName: string = 'ObjectTypeCallProperty';
  value: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.value.errors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.value.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof ObjectTypeCallProperty)) {
      return -1;
    }
    return compareTypes(this.value, input.value);
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