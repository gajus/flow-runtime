/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import ObjectTypeProperty from './ObjectTypeProperty';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class ObjectTypeIndexer<K: string | number, V> extends Type {
  typeName: string = 'ObjectTypeIndexer';
  id: string;
  key: Type<K>;
  value: Type<V>;

  *errors (validation: Validation<any>, path: IdentifierPath, key: any, value: any): Generator<ErrorTuple, void, void> {
    // special case number types
    if (this.key.typeName === 'NumberType' || this.key.typeName === 'NumericLiteralType') {
      key = +key;
    }

    yield* this.key.errors(validation, path.concat('[[Key]]'), key);
    yield* this.value.errors(validation, path.concat(key), value);
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

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof ObjectTypeProperty) {
      if (!this.key.accepts(input.key)) {
        return -1;
      }
      else {
        return compareTypes(this.value, input.value);
      }
    }
    else if (!(input instanceof ObjectTypeIndexer)) {
      return -1;
    }

    const keyResult = compareTypes(this.key, input.key);
    if (keyResult === -1) {
      return -1;
    }
    const valueResult = compareTypes(this.value, input.value);
    if (valueResult === -1) {
      return -1;
    }

    if (keyResult === 0 && valueResult === 0) {
      return 0;
    }
    else {
      return 1;
    }
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
