/* @flow */

import TypeConstructor from './TypeConstructor';

import type Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class GenericType extends TypeConstructor {

  typeName: string = 'GenericType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {name, impl} = this;
    if (input instanceof impl) {
      return false;
    }
    validation.addError(path, this, getErrorMessage('ERR_EXPECT_INSTANCEOF', name));
    return true;
  }

  accepts <P> (input: any, ...typeInstances: Type<P>[]): boolean {
    return input instanceof this.impl;
  }

  acceptsType (input: Type<any>): boolean {
    return input instanceof GenericType && input.impl === this.impl;
  }

  inferTypeParameters <P> (input: any): Type<P>[] {
    return [];
  }
}