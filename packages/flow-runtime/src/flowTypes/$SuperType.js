/* @flow */

import Type from '../types/Type';
import compareTypes from '../compareTypes';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// Any, but at least T.

export default class $SuperType<T> extends Type<$Supertype<T>> {
  typeName: string = '$SuperType';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.type.errors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.type.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Supertype<T>> {
    return this.type;
  }

  toString (): string {
    return `$Supertype<${this.type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}