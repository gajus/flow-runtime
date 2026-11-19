/* @flow */

import Type from '../types/Type';
import ArrayType from '../types/ArrayType';
import makeError from '../makeError';
import compareTypes from '../compareTypes';

// The type of a read-only array (the type of `$ReadOnly<T>` when `T` is an array).
//
// Validation is identical to `Array<T>`; the difference is in what the assertion
// leaves behind. `$ReadOnlyArray<T>` promises the value cannot be mutated, so the
// asserted value is replaced with a frozen copy. Copying first keeps a caller that
// passed an array it still intends to write to intact.

export default class $ReadOnlyArrayType<T> extends Type<$ReadOnlyArray<T>> {
  typeName: string = '$ReadOnlyArrayType';

  elementType: Type<T>;

  // Validation is exactly `Array<T>`, so borrow it with the element type wired up.
  asArrayType (): ArrayType<T> {
    const arrayType = new ArrayType(this.context);
    arrayType.elementType = this.elementType;
    return arrayType;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.asArrayType().errors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.asArrayType().accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof $ReadOnlyArrayType) {
      return compareTypes(this.elementType, input.elementType);
    }

    return -1;
  }

  /**
   * Freeze a copy of `input` so the read-only promise holds for the asserted value.
   */
  assert <V: $ReadOnlyArray<T>> (input: V): V {
    const error = makeError(this, input);
    if (error) {
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(error, this.assert);
      }
      throw error;
    }

    return (Object.freeze([...input]): any);
  }

  toString (): string {
    return `$ReadOnlyArray<${this.elementType.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      elementType: this.elementType
    };
  }
}
