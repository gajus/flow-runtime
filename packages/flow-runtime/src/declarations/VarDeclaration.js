/* @flow */

import Declaration from './Declaration';

import type {Type, TypeConstraint} from '../types';

import type Validation, {IdentifierPath} from '../Validation';

export default class VarDeclaration<T> extends Declaration {
  typeName: string = 'VarDeclaration';

  name: string;
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (constraint: TypeConstraint): VarDeclaration<T> {
    this.constraints.push(constraint);
    return this;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {constraints, type} = this;
    let hasErrors = false;
    if (type.collectErrors(validation, path, input)) {
      hasErrors = true;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      const violation = constraint(input);
      if (typeof violation === 'string') {
        validation.addError(path, this, violation);
        hasErrors = true;
      }
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (typeof constraint(input) === 'string') {
        return false;
      }
    }
    return true;
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