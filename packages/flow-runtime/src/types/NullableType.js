/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import NullLiteralType from './NullLiteralType';
import VoidType from './VoidType';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class NullableType<T> extends Type<T> {
  typeName: string = 'NullableType';
  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (input != null) {
      yield* this.type.errors(validation, path, input);
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

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof NullLiteralType || input instanceof VoidType) {
      return 1;
    }
    else if (input instanceof NullableType) {
      return compareTypes(this.type, input.type);
    }
    else {
      const result = compareTypes(this.type, input);
      if (result === -1) {
        return -1;
      }
      else {
        return 1;
      }
    }
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this;
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
