/* @flow */

import type {
  Type,
  TypeConstraint
} from './types';

import type Validation, {IdentifierPath} from './Validation';

export type ConstrainableType<T> = Type<T> & {constraints: TypeConstraint[]};

/**
 * Add constraints to the given subject type.
 */
export function addConstraints (subject: ConstrainableType<any>, ...constraints: TypeConstraint[]) {
  subject.constraints.push(...constraints);
}

/**
 * Collect any errors from constraints on the given subject type.
 */
export function collectConstraintErrors (subject: ConstrainableType<any>, validation: Validation<any>, path: IdentifierPath, ...input: any[]): boolean {
  const {constraints} = subject;
  const {length} = constraints;
  let hasErrors = false;
  for (let i = 0; i < length; i++) {
    const constraint = constraints[i];
    const violation = constraint(...input);
    if (typeof violation === 'string') {
      validation.addError(path, this, violation);
      hasErrors = true;
    }
  }
  return hasErrors;
}

/**
 * Determine whether the input passes the constraints on the subject type.
 */
export function constraintsAccept (subject: ConstrainableType<any>, ...input: any[]): boolean {
  const {constraints} = subject;
  const {length} = constraints;
  for (let i = 0; i < length; i++) {
    const constraint = constraints[i];
    if (typeof constraint(...input) === 'string') {
      return false;
    }
  }
  return true;
}