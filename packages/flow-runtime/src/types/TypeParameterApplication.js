/* @flow */

import Type from './Type';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import type {ApplicableType} from './';

import type ObjectTypeProperty from './ObjectTypeProperty';

import ParameterizedClassDeclaration from "../declarations/ParameterizedClassDeclaration";

import {TypeParametersSymbol, TypeSymbol} from "../symbols";

/**
 * # TypeParameterApplication
 *
 */
export default class TypeParameterApplication<X, T> extends Type {
  typeName: string = 'TypeParameterApplication';
  parent: ApplicableType<T>;
  typeInstances: Type<X>[] = [];

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {parent, typeInstances} = this;

    // explicitly set recorded type parameter in TypeParameter
    if (parent && parent.impl && parent.impl[TypeSymbol] && input) {
      const parentType : Type = parent.impl[TypeSymbol];

      if (parentType instanceof ParameterizedClassDeclaration) {
        const declTypeParameters = parentType.typeParameters;
        const parentTypeParameters : Symbol = parent.impl[TypeParametersSymbol];
        const inputTypeParameters = input[parentTypeParameters];

        if (declTypeParameters && inputTypeParameters
            && declTypeParameters.length !== 0
            && declTypeParameters.length === this.typeInstances.length) {
          declTypeParameters.forEach( (declTypeParameter : TypeParameter, index : number) => {
            const inputTypeParameter : TypeParameter = inputTypeParameters[declTypeParameter.id];
            if (inputTypeParameter) {
              inputTypeParameter.recorded = this.typeInstances[index];
            }
          } );
        }
      }
    }

    yield* parent.errors(validation, path, input, ...typeInstances);
  }

  accepts (input: any): boolean {
    const {parent, typeInstances} = this;
    return parent.accepts(input, ...typeInstances);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return this.parent.compareWith(input, ...this.typeInstances);
  }

  hasProperty (name: string): boolean {
    const inner = this.parent;
    if (inner && typeof (inner: $FlowIgnore).hasProperty === 'function') {
      return (inner: $FlowIgnore).hasProperty(name, ...this.typeInstances);
    }
    else {
      return false;
    }
  }

  getProperty (name: string): ? ObjectTypeProperty<any> {
    const inner = this.parent;
    if (inner && typeof (inner: $FlowIgnore).getProperty === 'function') {
      return (inner: $FlowIgnore).getProperty(name, ...this.typeInstances);
    }
  }

  unwrap () {
    return this.parent.unwrap(...this.typeInstances);
  }

  toString (): string {
    const {parent, typeInstances} = this;
    const {name} = parent;
    if (typeInstances.length) {
      const items = [];
      for (let i = 0; i < typeInstances.length; i++) {
        const typeInstance = typeInstances[i];
        items.push(typeInstance.toString());
      }
      return `${name}<${items.join(', ')}>`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeInstances: this.typeInstances
    };
  }
}
