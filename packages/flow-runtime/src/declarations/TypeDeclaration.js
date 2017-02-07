/* @flow */

import Declaration from './Declaration';
import compareTypes from '../compareTypes';

import type {
  Type,
  TypeAlias,
  ParameterizedTypeAlias,
  TypeConstraint,
  TypeParameterApplication,
  ObjectTypeProperty
} from '../types';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class TypeDeclaration<T> extends Declaration {
  typeName: string = 'TypeDeclaration';

  get type (): Type<T> {
    return this.typeAlias.type;
  }

  typeAlias: TypeAlias<T> | ParameterizedTypeAlias<T>;

  addConstraint (...constraints: TypeConstraint[]): TypeDeclaration<T> {
    this.typeAlias.addConstraint(...constraints);
    return this;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.typeAlias.errors(validation, path, input);
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, T> {
    return this.typeAlias.apply(...typeInstances);
  }

  accepts (input: any): boolean {
    return this.typeAlias.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.typeAlias, input);
  }

  hasProperty (name: string, ...typeInstances: Type<any>[]): boolean {
    return this.typeAlias.hasProperty(name, ...typeInstances);
  }

  getProperty (name: string, ...typeInstances: Type<any>[]): ? ObjectTypeProperty<any> {
    return this.typeAlias.getProperty(name, ...typeInstances);
  }

  /**
   * Get the inner type or value.
   */
  unwrap (...typeInstances: Type<any>[]): Type<any> {
    return this.typeAlias.unwrap(...typeInstances);
  }

  toString (): string {
    return `declare ${this.typeAlias.toString(true)};`;
  }
}