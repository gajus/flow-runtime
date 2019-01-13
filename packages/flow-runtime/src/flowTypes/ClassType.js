/* @flow */

import Type from '../types/Type';
import GenericType from '../types/GenericType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import type TypeContext from '../TypeContext';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

function checkGenericType (context: TypeContext, expected: GenericType, input: Function) {
  const {impl} = expected;
  if (typeof impl !== 'function') {
    // There is little else we can do here, so accept anything.
    return true;
  }
  else if (impl === input || impl.isPrototypeOf(input)) {
    return true;
  }

  const annotation = context.getAnnotation(impl);
  if (annotation == null) {
    return false;
  }
  else {
    return checkType(context, annotation, input);
  }
}

function checkType (context: TypeContext, expected: Type<*>, input: Function) {
  const annotation = context.getAnnotation(input);
  if (annotation != null) {
    const result = compareTypes(expected, annotation);
    return result !== -1;
  }
  return true;
}


export default class ClassType<T> extends Type<T> {
  typeName: string = 'ClassType';

  instanceType: Type<*>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {

    const {instanceType, context} = this;
    if (typeof input !== 'function') {
      yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
      return;
    }
    const expectedType = (
      instanceType.typeName === 'ClassDeclaration'
      ? instanceType
      : instanceType.unwrap()
    );
    const isValid = (
      expectedType instanceof GenericType
      ? checkGenericType(context, expectedType, input)
      : checkType(context, expectedType, input)
    );
    if (!isValid) {
      yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
    }
  }

  accepts (input: any): boolean {
    const {instanceType, context} = this;
    if (typeof input !== 'function') {
      return false;
    }
    const expectedType = (
      instanceType.typeName === 'ClassDeclaration'
      ? instanceType
      : instanceType.unwrap()
    );
    if (expectedType instanceof GenericType) {
      return checkGenericType(context, expectedType, input);
    }
    else {
      return checkType(context, expectedType, input);
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
