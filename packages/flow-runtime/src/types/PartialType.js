
import Type from './Type';
import type {TypeConstraint} from './';
import type Validation, {IdentifierPath} from '../Validation';

import TypeParameter, {openTypeParameters, closeTypeParameters} from './TypeParameter';
import type {TypeParameterStatus} from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';

import {collectConstraintErrors, constraintsAccept} from '../typeConstraints';

import {TypeParameterStatusSymbol} from '../symbols';


export default class PartialType<X, T> extends Type {
  typeName: string = 'PartialType';
  name: string;
  type: Type<T>;
  typeParameters: TypeParameter<X>[] = [];
  constraints: ? TypeConstraint[];

  [TypeParameterStatusSymbol]: TypeParameterStatus = 'closed';

  typeParameter (id: string, bound?: Type<X>): TypeParameter<X> {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    target[TypeParameterStatusSymbol] = this[TypeParameterStatusSymbol];
    this.typeParameters.push(target);
    return target;
  }

  openTypeParameters () {
    if (this[TypeParameterStatusSymbol] !== 'open') {
      const {typeParameters} = this;
      openTypeParameters(...typeParameters);
      this[TypeParameterStatusSymbol] = 'open';
    }
  }

  closeTypeParameters () {
    if (this[TypeParameterStatusSymbol] !== 'closed') {
      const {typeParameters} = this;
      closeTypeParameters(...typeParameters);
      this[TypeParameterStatusSymbol] = 'closed';
    }
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
    else if (constraints && collectConstraintErrors(this, validation, path, input)) {
      hasErrors = true;
    }
    return hasErrors;
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    else if (constraints && !constraintsAccept(this, input)) {
      return false;
    }
    else {
      return true;
    }
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
  unwrap (): Type<T> {
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