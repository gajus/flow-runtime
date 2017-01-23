/* @flow */

import Type from '../types/Type';

import type Validation, {IdentifierPath} from '../Validation';

// Any subtype of T

export default class $FlowFixMeType extends Type<any> {
  typeName: string = '$FlowFixMeType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return false;
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