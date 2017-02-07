/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import FunctionTypeParam from './FunctionTypeParam';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class FunctionTypeRestParam<T> extends Type {
  typeName: string = 'FunctionTypeRestParam';
  name: string;
  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {type} = this;
    yield* type.errors(validation, path, input);
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
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

  toString (): string {
    const {type} = this;
    return `...${this.name}: ${type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}
