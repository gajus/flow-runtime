/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import type Validation, {IdentifierPath} from '../Validation';


export default class FunctionTypeReturn<T> extends Type {
  typeName: string = 'FunctionTypeReturn';
  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    return type.collectErrors(validation, path.concat('[[Return Type]]'), input);
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
