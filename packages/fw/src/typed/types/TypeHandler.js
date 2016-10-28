/* @flow */

import Type from './Type';
import type {Constructor} from './';

import TypeParameterApplication from './TypeParameterApplication';

export default class TypeHandler extends Type {
  typeName: string = 'TypeHandler';
  name: string;
  impl: ? Constructor;

  accepts (input: any, ...typeInstances: Type[]): boolean {
    throw new Error(`No acceptser for ${this.name}.`);
  }

  acceptsType (input: Type): boolean {
    throw new Error(`No acceptser for ${this.name}.`);
  }

  inferTypeParameters (input: any): Type[] {
    throw new Error(`No inferrer for ${this.name}.`);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type handler: ${this.name}.`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    const {impl} = this;
    if (impl) {
      return impl;
    }
    else {
      return this;
    }
  }

  toString (): string {
    return this.name;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name
    };
  }

}
