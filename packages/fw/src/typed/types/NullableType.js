/* @flow */

import Type from './Type';
import type {Constructor} from './';

export default class NullableType extends Type {
  typeName: string = 'NullableType';
  type: Type;

  accepts (input: any): boolean {
    if (input == null) {
      return true;
    }
    else {
      return this.type.accepts(input);
    }
  }

  acceptsType (input: Type): boolean {
    if (input instanceof NullableType) {
      return this.type.acceptsType(input.type);
    }
    else {
      return this.type.acceptsType(input);
    }
  }

  makeErrorMessage (): string {
    return this.type.makeErrorMessage();
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this.type.resolve();
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
