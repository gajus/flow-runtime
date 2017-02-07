
import Type from './Type';
import type {TypeConstraint} from './';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import type ObjectTypeProperty from './ObjectTypeProperty';

import TypeParameterApplication from './TypeParameterApplication';
import {addConstraints, collectConstraintErrors, constraintsAccept} from '../typeConstraints';

export default class RefinementType<T> extends Type {
  typeName: string = 'RefinementType';
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (...constraints: TypeConstraint[]): RefinementType<T> {
    addConstraints(this, ...constraints);
    return this;
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
      return 0;
    }
    else {
      return -1;
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

  toString (): string {
    const {type} = this;
    return `$Refinment<${type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}
