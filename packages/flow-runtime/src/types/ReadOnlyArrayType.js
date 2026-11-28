/* @flow */

import ArrayType from './ArrayType';
import TupleType from './TupleType';
import compareTypes from '../compareTypes';

import {
  inToStringCycle,
  startToStringCycle,
  endToStringCycle
} from '../cyclic';

// A $ReadOnlyArray<T> accepts the same inputs as Array<T>, but unlike
// Array<T> it cannot be written to. Any Array<T> or tuple is a valid
// $ReadOnlyArray<T>, so type comparison is covariant in both directions
// that arrays can flow into it.
export default class ReadOnlyArrayType <T> extends ArrayType<T> {
  typeName: string = 'ReadOnlyArrayType';

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {elementType} = this;
    if (input instanceof TupleType) {
      const {types} = input;
      for (let i = 0; i < types.length; i++) {
        const result = compareTypes(elementType, types[i]);
        if (result === -1) {
          return -1;
        }
      }
      return 1;
    }
    else if (input instanceof ArrayType) {
      // note: ReadOnlyArrayType extends ArrayType, so this covers
      // both plain arrays and other read-only arrays.
      return compareTypes(elementType, input.elementType);
    }
    else {
      return -1;
    }
  }

  toString (): string {
    const {elementType} = this;
    if (inToStringCycle(this)) {
      if (typeof elementType.name === 'string') {
        return `$ReadOnlyArray<$Cycle<${elementType.name}>>`;
      }
      else {
        return `$ReadOnlyArray<$Cycle<Object>>`;
      }
    }
    startToStringCycle(this);
    const output = `$ReadOnlyArray<${elementType.toString()}>`;
    endToStringCycle(this);
    return output;
  }
}
