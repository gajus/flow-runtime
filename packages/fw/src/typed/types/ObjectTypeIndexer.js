/* @flow */

import Type from './Type';

export default class ObjectTypeIndexer extends Type {
  typeName: string = 'ObjectTypeIndexer';
  id: string;
  key: Type;
  value: Type;

  match (key: any, value: any): boolean {
    return this.key.match(key) && this.value.match(value);
  }

  matchType (input: Type): boolean {
    if (!(input instanceof ObjectTypeIndexer)) {
      return false;
    }
    return this.key.matchType(input.key) && this.value.matchType(input.value);
  }

  makeErrorMessage (): string {
    return `Invalid object indexer: ${this.id}.`;
  }

  toString (): string {
    return `[${this.id}: ${this.key.toString()}]: ${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      id: this.id,
      key: this.key,
      value: this.value
    };
  }
}
