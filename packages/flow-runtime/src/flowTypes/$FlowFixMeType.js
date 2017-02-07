/* @flow */

import Type from '../types/Type';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// Any subtype of T

export default class $FlowFixMeType extends Type<any> {
  typeName: string = '$FlowFixMeType';

  *errors (validation: Validation<any>, input: any, path: IdentifierPath = []): Generator<ErrorTuple, void, void> {

  }

  accepts (input: any): boolean {
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return 1;
  }

  unwrap (): Type<any> {
    return this;
  }

  toString (): string {
    return '$FlowFixMe';
  }

  toJSON () {
    return {
      typeName: this.typeName,
    };
  }
}