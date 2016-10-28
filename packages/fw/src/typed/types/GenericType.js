/* @flow */

import TypeHandler from './TypeHandler';

import type Type from './Type';

export default class GenericType extends TypeHandler {
  typeName: string = 'GenericType';

  match (input: any, ...typeInstances: Type[]): boolean {
    return input instanceof this.impl;
  }

  matchType (input: Type): boolean {
    return input instanceof GenericType && input.impl === this.impl;
  }

  inferTypeParameters (input: any): Type[] {
    return [];
  }

  makeErrorMessage (): string {
    return `Invalid value for generic type: ${this.name}.`;
  }

}