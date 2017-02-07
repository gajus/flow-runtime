/* @flow */

import Type from '../types/Type';
import GenericType from '../types/GenericType';
import TypeParameterApplication from '../types/TypeParameterApplication';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';


import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class ClassType<T> extends Type {
  typeName: string = 'ClassType';

  instanceType: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {instanceType, context} = this;
    if (typeof input !== 'function') {
      yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
    }
    const expectedType = instanceType.unwrap();
    if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
      if (input === expectedType.impl) {
        return;
      }
      else if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
        return;
      }
      else {
        yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
        return;
      }
    }
    const annotation = context.getAnnotation(input);
    if (annotation) {
      if (!expectedType.acceptsType(annotation)) {
        yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
      }
      return;
    }
    let matches;
    // we're dealing with a type
    switch (input.typeName) {
      case 'NumberType':
      case 'NumericLiteralType':
        matches = input === Number;
        break;
      case 'BooleanType':
      case 'BooleanLiteralType':
        matches = input === Boolean;
        break;
      case 'StringType':
      case 'StringLiteralType':
        matches = input === String;
        break;
      case 'ArrayType':
      case 'TupleType':
        matches = input === Array;
        break;
      default:
        return;
    }
    if (!matches) {
      yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
    }
  }

  accepts (input: any): boolean {
    const {instanceType, context} = this;
    if (typeof input !== 'function') {
        return false;
      }
      let expectedType = instanceType.unwrap();
      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (input === expectedType.impl) {
          return true;
        }
        else if (typeof expectedType.impl === 'function') {
          if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
            return true;
          }
          else {
            return false;
          }
        }
      }

      const annotation = context.getAnnotation(input);

      if (annotation) {
        return expectedType.acceptsType(annotation);
      }
      else if (expectedType instanceof TypeParameterApplication) {
        expectedType = expectedType.parent;
      }

      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
          return true;
        }
        else {
          return false;
        }
      }

      // we're dealing with a type
      switch (input.typeName) {
        case 'NumberType':
        case 'NumericLiteralType':
          return input === Number;
        case 'BooleanType':
        case 'BooleanLiteralType':
          return input === Boolean;
        case 'StringType':
        case 'StringLiteralType':
          return input === String;
        case 'ArrayType':
        case 'TupleType':
          return input === Array;
        default:
          return false;
      }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {instanceType} = this;
    if (input instanceof ClassType) {
      return compareTypes(instanceType, input.instanceType);
    }
    return -1;
  }

  toString (): string {
    return `Class<${this.instanceType.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      instanceType: this.instanceType
    };
  }
}