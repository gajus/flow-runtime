/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeConstraint} from './';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';
import {addConstraints, collectConstraintErrors, constraintsAccept} from '../typeConstraints';


export default class ObjectTypeProperty<K: string | number, V> extends Type {
  typeName: string = 'ObjectTypeProperty';
  key: K;
  value: Type<V>;
  optional: boolean;
  // @flowIgnore
  'static': boolean;
  constraints: TypeConstraint[] = [];

  addConstraint (...constraints: TypeConstraint[]): ObjectTypeProperty<K, V> {
    addConstraints(this, ...constraints);
    return this;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {optional, key, value} = this;
    if (optional && input[key] === undefined) {
      return;
    }
    let hasErrors = false;
    for (const error of value.errors(validation, path.concat(key), input[key])) {
      hasErrors = true;
      yield error;
    }
    if (!hasErrors) {
      yield* collectConstraintErrors(this, validation, path.concat(key), input[key]);
    }
  }

  accepts (input: Object): boolean {
    if (this.optional && input[this.key] === undefined) {
      return true;
    }
    else if (!this.value.accepts(input[this.key])) {
      return false;
    }
    else {
      return constraintsAccept(this, input[this.key]);
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof ObjectTypeProperty)) {
      return -1;
    }
    else if (input.key !== this.key) {
      return -1;
    }
    else {
      return compareTypes(this.value, input.value);
    }
  }

  unwrap (): Type<V> {
    return this.value.unwrap();
  }

  toString (): string {
    let key = this.key;
    if (typeof key === 'symbol') {
      key = `[${key.toString()}]`;
    }
    if (this.static) {
      return `static ${key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
    }
    else {
      return `${key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      key: this.key,
      value: this.value,
      optional: this.optional
    };
  }
}