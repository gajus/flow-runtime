/* @flow */

import Declaration from './Declaration';
import compareTypes from '../compareTypes';

import type {Type, TypeConstraint} from '../types';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

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

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {type} = this;
    let hasErrors = false;
    for (const error of type.errors(validation, path, input)) {
      hasErrors = true;
      yield error;
    }
    if (!hasErrors) {
      yield* collectConstraintErrors(this, validation, path, input);
    }
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

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.type, input);
  }

  unwrap () {
    return this.type.unwrap();
  }

  toString (): string {
    return `declare var ${this.name}: ${this.type.toString()};`;
  }
}