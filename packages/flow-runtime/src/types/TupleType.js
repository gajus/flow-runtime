/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class TupleType<T> extends Type {
  typeName: string = 'TupleType';
  types: Type<T>[] = [];

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {types} = this;
    const {length} = types;
    const {context} = this;
    if (!context.checkPredicate('Array', input)) {
      yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this];
      return;
    }
    for (let i = 0; i < length; i++) {
      yield* types[i].errors(validation, path.concat(i), input[i]);
    }
  }

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    const {context} = this;

    if (!context.checkPredicate('Array', input) || input.length < length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.accepts(input[i])) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof TupleType)) {
      return -1;
    }
    const types = this.types;
    const inputTypes = input.types;
    if (inputTypes.length < types.length) {
      return -1;
    }
    let isGreater = false;
    for (let i = 0; i < types.length; i++) {
      const result = compareTypes(types[i], inputTypes[i]);
      if (result === 1) {
        isGreater = true;
      }
      else if (result === -1) {
        return -1;
      }
    }
    if (types.length < inputTypes.length) {
      return 0;
    }
    else if (isGreater) {
      return 1;
    }
    else {
      return 0;
    }
  }

  toString (): string {
    return `[${this.types.join(', ')}]`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}