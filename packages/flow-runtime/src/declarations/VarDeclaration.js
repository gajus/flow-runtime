/* @flow */

import Declaration from './Declaration';

import type {Type, TypeConstraint} from '../types';

import type Validation, {IdentifierPath} from '../Validation';

import {addConstraints, collectConstraintErrors, constraintsAccept} from '../typeConstraints';

export default class VarDeclaration<T> extends Declaration {
  typeName: string = 'VarDeclaration';

  name: string;
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (...constraints: TypeConstraint[]): VarDeclaration<T> {
    addConstraints(this, ...constraints);
    return this;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    let hasErrors = false;
    if (type.collectErrors(validation, path, input)) {
      hasErrors = true;
    }
    else if (collectConstraintErrors(this, validation, path, input)) {
      hasErrors = true;
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    else if (!constraintsAccept(this, input)) {
      return false;
    }
    else {
      return true;
    }
  }

  acceptsType (input: Type<any>): boolean {
    return this.type.acceptsType(input);
  }

  unwrap () {
    return this.type.unwrap();
  }

  toString (): string {
    return `declare var ${this.name}: ${this.type.toString()};`;
  }
}