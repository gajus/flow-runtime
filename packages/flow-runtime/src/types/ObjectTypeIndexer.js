/* @flow */

import Type from './Type';

import type Validation, {IdentifierPath} from '../Validation';

export default class ObjectTypeIndexer<K: string | number, V> extends Type {
  typeName: string = 'ObjectTypeIndexer';
  id: string;
  key: Type<K>;
  value: Type<V>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, key: any, value: any): boolean {
    // special case number types
    if (this.key.typeName === 'NumberType' || this.key.typeName === 'NumericLiteralType') {
      key = +key;
    }
    let hasErrors = this.key.collectErrors(validation, path.concat('[[Key]]'), key);
    if (this.value.collectErrors(validation, path.concat(key), value)) {
      hasErrors = true;
    }
    return hasErrors;
  }

  accepts (value: any): boolean {
    return this.value.accepts(value);
  }

  acceptsKey (key: any): boolean {
    // special case number types
    if (this.key.typeName === 'NumberType' || this.key.typeName === 'NumericLiteralType') {
      key = +key;
    }
    return this.key.accepts(key);
  }

  acceptsValue (value: any): boolean {
    return this.value.accepts(value);
  }

  acceptsType (input: Type<any>): boolean {
    if (!(input instanceof ObjectTypeIndexer)) {
      return false;
    }
    return this.key.acceptsType(input.key) && this.value.acceptsType(input.value);
  }

  unwrap (): Type<V> {
    return this.value.unwrap();
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
