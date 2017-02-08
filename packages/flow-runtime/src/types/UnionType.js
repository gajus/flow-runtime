/* @flow */

import Type from './Type';
import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import compareTypes from '../compareTypes';

export default class UnionType<T> extends Type {
  typeName: string = 'UnionType';
  types: Type<T>[] = [];

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.accepts(input)) {
        return;
      }
    }
    yield [path, getErrorMessage('ERR_NO_UNION', this.toString()), this];
  }

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.accepts(input)) {
        return true;
      }
    }
    return false;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const types = this.types;
    if (input instanceof UnionType) {
      const inputTypes = input.types;
      let identicalCount = 0;
      loop: for (let i = 0; i < types.length; i++) {
        const type = types[i];
        for (let j = 0; j < inputTypes.length; j++) {
          const result = compareTypes(type, inputTypes[i]);
          if (result === 0) {
            identicalCount++;
            continue loop;
          }
          else if (result === 1) {
            continue loop;
          }
        }
        // if we got this far then nothing accepted this type.
        return -1;
      }

      if (identicalCount === types.length) {
        return 0;
      }
      else {
        return 1;
      }
    }
    else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (compareTypes(type, input) >= 0) {
          return 1;
        }
      }
      return -1;
    }
  }

  toString (): string {
    const {types} = this;
    const normalized = new Array(types.length);
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (type.typeName === 'FunctionType' || type.typeName === 'ParameterizedFunctionType') {
        normalized[i] = `(${type.toString()})`;
      }
      else {
        normalized[i] = type.toString();
      }
    }
    return normalized.join(' | ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}