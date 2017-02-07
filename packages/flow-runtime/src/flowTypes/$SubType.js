/* @flow */

import Type from '../types/Type';
import compareTypes from '../compareTypes';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// Any subtype of T

export default class $SubType<T> extends Type<$Subtype<T>> {
  typeName: string = '$SubType';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.type.errors(input, path);
  }

  accepts (input: any): boolean {
    return this.type.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Subtype<T>> {
    return this.type;
  }

  toString (): string {
    return `$Subtype<${this.type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}