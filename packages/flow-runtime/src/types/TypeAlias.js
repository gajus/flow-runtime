
import Type from './Type';
import type {Constructor, TypeConstraint} from './';
import type Validation, {IdentifierPath} from '../Validation';

import type ObjectTypeProperty from './ObjectTypeProperty';

import TypeParameterApplication from './TypeParameterApplication';

export default class TypeAlias<T> extends Type {
  typeName: string = 'TypeAlias';
  name: string;
  type: Type<T>;
  constraints: TypeConstraint[] = [];

  addConstraint (constraint: TypeConstraint): TypeAlias {
    this.constraints.push(constraint);
    return this;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {constraints, type} = this;
    if (type.collectErrors(validation, path, input)) {
      return true;
    }
    const {length} = constraints;
    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        validation.addError(path, 'ERR_CONSTRAINT_VIOLATION');
        hasErrors = true;
      }
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        return false;
      }
    }
    return true;
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

  makeErrorMessage (): string {
    return `Invalid value for type: ${this.name}.`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type<T> | Constructor {
    return this.type.resolve();
  }

  hasProperty (name: string): boolean {
    const inner = this.resolve();
    if (inner && typeof inner.hasProperty === 'function') {
      return inner.hasProperty(name);
    }
    else {
      return false;
    }
  }

  getProperty (name: string): ? ObjectTypeProperty<any> {
    const inner = this.resolve();
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
