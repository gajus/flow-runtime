/* @flow */

import UnionType from './types/UnionType';
import type TypeContext from './TypeContext';
import type Type from './types/Type';

export default function makeUnion <T> (context: TypeContext, types: Type<T>[]): UnionType<T> {
  const length = types.length;
  const merged = [];
  for (let i = 0; i < length; i++) {
    const type = types[i];
    if (type instanceof UnionType) {
      mergeUnionTypes(merged, type.types);
    }
    else {
      merged.push(type);
    }
  }
  const union = new UnionType(context);
  union.types = merged;
  return union;
}

function mergeUnionTypes (aTypes: Type<any>[], bTypes: Type<any>[]): void {
  loop: for (let i = 0; i < bTypes.length; i++) {
    const bType = bTypes[i];
    for (let j = 0; j < aTypes.length; j++) {
      const aType = aTypes[j];
      if (aType.acceptsType(bType)) {
        continue loop;
      }
    }
    aTypes.push(bType);
  }
}