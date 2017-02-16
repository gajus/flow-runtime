/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import getErrorMessage from "../getErrorMessage";

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class ObjectTypeCallProperty<T: Function> extends Type {
  typeName: string = 'ObjectTypeCallProperty';
  value: Type<T>;
  // @flowIgnore
  'static': boolean = false;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    // @flowIgnore
    const {value, static: isStatic} = this;

    let target;
    let targetPath;
    if (isStatic) {
      if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }
      targetPath = path.concat('constructor');
      if (typeof input.constructor !== 'function') {
        yield [targetPath, getErrorMessage('ERR_EXPECT_FUNCTION'), this];
        return;
      }
      target = input.constructor;
    }
    else {
      target = input;
      targetPath = path;
    }
    yield* value.errors(validation, targetPath, target);
  }

  accepts (input: any): boolean {
    // @flowIgnore
    const {value, static: isStatic} = this;
    let target;
    if (isStatic) {
      if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
        return false;
      }
      if (typeof input.constructor !== 'function') {
        return false;
      }
      target = input.constructor;
    }
    else {
      target = input;
    }
    return value.accepts(target);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof ObjectTypeCallProperty)) {
      return -1;
    }
    return compareTypes(this.value, input.value);
  }

  unwrap (): Type<T> {
    return this.value.unwrap();
  }


  toString (): string {
    if (this.static) {
      return `static ${this.value.toString()};`;
    }
    else {
      return this.value.toString();
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}