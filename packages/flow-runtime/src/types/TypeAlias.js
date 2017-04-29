
import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeConstraint} from './';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import type ObjectTypeProperty from './ObjectTypeProperty';

import TypeParameterApplication from './TypeParameterApplication';
import {addConstraints, collectConstraintErrors, constraintsAccept} from '../typeConstraints';

export default class TypeAlias<T> extends Type {
  typeName: string = 'TypeAlias';
  name: string;
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (...constraints: TypeConstraint[]): TypeAlias<T> {
    addConstraints(this, ...constraints);
    return this;
  }

  get properties () {
    return this.type.properties;
  }

  get hasConstraints (): boolean {
    return this.constraints.length > 0;
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
    if (input === this) {
      return 0; // should never need this because it's taken care of by compareTypes.
    }
    else if (this.hasConstraints) {
      // if we have constraints the types cannot be the same
      return -1;
    }
    else {
      return compareTypes(this.type, input);
    }
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this.type.unwrap();
  }

  hasProperty (name: string): boolean {
    const inner = this.unwrap();
    if (inner && typeof inner.hasProperty === 'function') {
      return inner.hasProperty(name);
    }
    else {
      return false;
    }
  }

  getProperty (name: string): ? ObjectTypeProperty<any> {
    const inner = this.unwrap();
    if (inner && typeof inner.getProperty === 'function') {
      return inner.getProperty(name);
    }
  }

  toString (withDeclaration?: boolean): string {
    const {name, type} = this;
    if (withDeclaration) {
      return `type ${name} = ${type.toString()};`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}
