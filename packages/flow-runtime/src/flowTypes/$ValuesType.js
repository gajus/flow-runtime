/* @flow */

import Type from '../types/Type';
import ObjectType from '../types/ObjectType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// The set of keys of T.

export default class $ValuesType<T: {}> extends Type<$Values<T>> {
  typeName: string = '$ValuesType';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Values<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.value.accepts(input)) {
        return;
      }
    }
    const values = new Array(length);
    for (let i = 0; i < length; i++) {
      values[i] = properties[i].value.toString();
    }
    yield [path, getErrorMessage('ERR_NO_UNION', values.join(' | ')), this];
  }

  accepts (input: any): boolean {
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Values<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.value.accepts(input)) {
        return true;
      }
    }
    return false;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Values<T>> {
    const context = this.context;
    const type = this.type.unwrap();
    invariant(type instanceof ObjectType, 'Can only $Values<T> object types.');

    const properties = type.properties;
    const length = properties.length;
    const values = new Array(length);
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      values[i] = property.value;
    }
    return context.union(...values);
  }

  toString (): string {
    return `$Values<${this.type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}