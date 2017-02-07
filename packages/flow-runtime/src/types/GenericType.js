/* @flow */

import TypeConstructor from './TypeConstructor';

import type Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class GenericType extends TypeConstructor {

  typeName: string = 'GenericType';

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {name, impl} = this;
    if (!(input instanceof impl)) {
      yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', name), this];
    }
  }

  accepts <P> (input: any, ...typeInstances: Type<P>[]): boolean {
    return input instanceof this.impl;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof GenericType && input.impl === this.impl) {
      return 0;
    }
    else {
      return -1;
    }
  }

  inferTypeParameters <P> (input: any): Type<P>[] {
    return [];
  }
}