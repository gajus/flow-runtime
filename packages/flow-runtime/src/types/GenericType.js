/* @flow */

import TypeConstructor from "./TypeConstructor";

import type Type from "./Type";
import compareTypes from "../compareTypes";

import getErrorMessage from "../getErrorMessage";
import type Validation, { ErrorTuple, IdentifierPath } from "../Validation";

export default class GenericType extends TypeConstructor {
  typeName: string = "GenericType";

  *errors(
    validation: Validation<any>,
    path: IdentifierPath,
    input: any
  ): Generator<ErrorTuple, void, void> {
    const { name, impl } = this;
    if (!(input instanceof impl)) {
      yield [path, getErrorMessage("ERR_EXPECT_INSTANCEOF", name), this];
    }
  }

  accepts<P>(input: any, ...typeInstances: Type<P>[]): boolean {
    const { impl } = this;
    return input instanceof impl;
  }

  compareWith<P>(input: Type<any>, ...typeInstances: Type<P>[]): -1 | 0 | 1 {
    const { context, impl } = this;
    const annotation = context.getAnnotation(impl);
    if (annotation) {
      const expected = annotation.unwrap(...typeInstances);
      return compareTypes(input, expected);
    } else if (
      input instanceof GenericType &&
      (input.impl === impl || (impl && impl.isPrototypeOf(input.impl)))
    ) {
      return 0;
    } else {
      return -1;
    }
  }

  unwrap<P>(...typeInstances: Type<P>[]) {
    const { context, impl } = this;
    if (typeof impl !== "function") {
      return this;
    }
    const annotation = context.getAnnotation(impl);
    if (annotation != null) {
      return (annotation.unwrap(...typeInstances): any);
    } else {
      return this;
    }
  }

  inferTypeParameters<P>(input: any): Type<P>[] {
    return [];
  }
}
