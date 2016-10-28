/* @flow */

import Type from './Type';
import type {Constructor} from './';

import TypeParameterApplication from './TypeParameterApplication';

export default class TypeReference extends Type {
  typeName: string = 'TypeReference';
  name: string;

  get type (): Type {
    const {context, name} = this;
    const type = context.get(name);
    if (!type) {
      throw new ReferenceError(`Cannot resolve type: ${name}`);
    }
    return type;
  }

  match (input: any): boolean {
    return this.type.match(input);
  }

  matchType (input: Type): boolean {
    return this.type.matchType(input);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
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
  resolve (): Type | Constructor {
    return this.type.resolve();
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
