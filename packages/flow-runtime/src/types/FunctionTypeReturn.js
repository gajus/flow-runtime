/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';


export default class FunctionTypeReturn<T> extends Type {
  typeName: string = 'FunctionTypeReturn';
  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {type} = this;
    yield* type.errors(validation, path.concat('[[Return Type]]'), input);
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof FunctionTypeReturn) {
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

  unwrap (): Type<T> {
    return this.type;
  }

  toString (): string {
    const {type} = this;
    return type.toString();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}
