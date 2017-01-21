/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeConstraint} from './';

import type Validation, {IdentifierPath} from '../Validation';
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

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {optional, key, value} = this;
    if (optional && input[key] === undefined) {
      return false;
    }
    let hasErrors = false;
    if (value.collectErrors(validation, path.concat(key), input[key])) {
      hasErrors = true;
    }
    else if (collectConstraintErrors(this, validation, path.concat(key), input[key])) {
      hasErrors = true;
    }
    return hasErrors;
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
    if (this.static) {
      return `static ${this.key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
    }
    else {
      return `${this.key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
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