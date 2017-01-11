
import Type from './Type';
import type {TypeConstraint} from './';
import type Validation, {IdentifierPath} from '../Validation';

import type ObjectTypeProperty from './ObjectTypeProperty';

import TypeParameterApplication from './TypeParameterApplication';
import {addConstraints, collectConstraintErrors, constraintsAccept} from '../typeConstraints';

export default class RefinmentType<T> extends Type {
  typeName: string = 'RefinmentType';
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (...constraints: TypeConstraint[]): RefinmentType<T> {
    addConstraints(this, ...constraints);
    return this;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    if (type.collectErrors(validation, path, input)) {
      return true;
    }
    else if (collectConstraintErrors(this, validation, path, input)) {
      return true;
    }
    return false;
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

  acceptsType (input: Type<any>): boolean {
    return this.type.acceptsType(input);
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
