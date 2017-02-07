/* @flow */

import Type from '../types/Type';
import ObjectType from '../types/ObjectType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// The set of keys of T.

export default class $KeysType<T: {}> extends Type<$Keys<T>> {
  typeName: string = '$KeysType';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (input === property.key) {
        return;
      }
    }
    const keys = new Array(length);
    for (let i = 0; i < length; i++) {
      keys[i] = properties[i].key;
    }
    yield [path, getErrorMessage('ERR_NO_UNION', keys.join(' | ')), this];
  }

  accepts (input: any): boolean {
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (input === property.key) {
        return true;
      }
    }
    return false;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Keys<T>> {
    const context = this.context;
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    const keys = new Array(length);
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      keys[i] = context.literal(property.key);
    }
    return this.context.union(...keys);
  }

  toString (): string {
    return `$Keys<${this.type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}