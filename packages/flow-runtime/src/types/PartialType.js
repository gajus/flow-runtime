
import Type from './Type';
import type {Constructor, TypeConstraint} from './';
import type Validation, {IdentifierPath} from '../Validation';

import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';

export default class PartialType<X, T> extends Type {
  typeName: string = 'PartialType';
  name: string;
  type: Type<T>;
  typeParameters: TypeParameter<X>[] = [];
  constraints: ? TypeConstraint[];

  typeParameter (id: string, bound?: Type<X>): TypeParameter<X> {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    this.typeParameters.push(target);
    return target;
  }

  apply (...typeInstances: Type<X>[]): TypeParameterApplication<X, T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {constraints, type} = this;
    let hasErrors = false;
    if (type.collectErrors(validation, path, input)) {
      hasErrors = true;
    }
    if (constraints) {
      const {length} = constraints;
      for (let i = 0; i < length; i++) {
        const constraint = constraints[i];
        const violation = constraint(input);
        if (typeof violation === 'string') {
          validation.addError(path, this, violation);
          hasErrors = true;
        }
      }
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    if (constraints) {
      const {length} = constraints;
      for (let i = 0; i < length; i++) {
        const constraint = constraints[i];
        if (typeof constraint(input) === 'string') {
          return false;
        }
      }
    }
    return true;
  }

  acceptsType (input: Type<any>): boolean {
    return this.type.acceptsType(input);
  }

  toString (expand?: boolean): string {
    const {type} = this;
    return type.toString(expand);
  }

  /**
   * Get the inner type or value.
   */
  unwrap (...typeInstances: Type<any>[]): Type | Constructor {
    const {length} = typeInstances;
    for (let i = 0; i < length; i++) {
      const typeParameter = this.typeParameters[i];
      if (typeParameter) {
        typeParameter.recorded = typeInstances[i];
      }
    }
    return this.type.unwrap();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeParameters: this.typeParameters,
      type: this.type
    };
  }
}