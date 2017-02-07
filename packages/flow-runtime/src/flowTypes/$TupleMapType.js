/* @flow */

import Type from '../types/Type';
import TupleType from '../types/TupleType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';

import FunctionType from '../types/FunctionType';


import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

type Mapper = <V: any, R: any> (v: V) => R;

// Map over the values in a tuple.

export default class $TupleMapType<T: [], M: Mapper> extends Type<$TupleMap<T, M>> {
  typeName: string = '$TupleMapType';

  tuple: Type<T>;
  mapper: Type<M>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    let {tuple, mapper, context} = this;
    const target = tuple.unwrap();
    invariant(target instanceof TupleType, 'Target must be a tuple type.');

    if (!context.checkPredicate('Array', input)) {
      yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this];
      return;
    }

    for (let i = 0; i < target.types.length; i++) {
      const type = target.types[i];
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      const expected = applied.invoke(type);
      const value = input[i];
      yield* expected.errors(validation, path.concat(i), value);
    }
  }

  accepts (input: any): boolean {
    let {tuple, mapper, context} = this;
    const target = tuple.unwrap();
    invariant(target instanceof TupleType, 'Target must be a tuple type.');

    if (!context.checkPredicate('Array', input)) {
      return false;
    }

    for (let i = 0; i < target.types.length; i++) {
      const type = target.types[i];
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      if (!applied.invoke(type).accepts(input[i])) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$TupleMap<T, M>> {
    let {tuple, mapper, context} = this;
    const target = tuple.unwrap();
    invariant(target instanceof TupleType, 'Target must be an tuple type.');

    const args = [];
    for (let i = 0; i < target.types.length; i++) {
      const type = target.types[i];
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      args.push(applied.invoke(type).unwrap().unwrap());
    }

    return context.tuple(...args);
  }

  toString (): string {
    return `$TupleMap<${this.tuple.toString()}, ${this.mapper.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      tuple: this.tuple,
      mapper: this.mapper
    };
  }
}