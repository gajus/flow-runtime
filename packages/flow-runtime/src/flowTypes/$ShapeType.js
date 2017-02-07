/* @flow */

import Type from '../types/Type';
import ObjectType from '../types/ObjectType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// An object of type $Shape<T> does not have to have all of the properties
// that type T defines. But the types of the properties that it does have
// must accepts the types of the same properties in T.

export default class $ShapeType<T> extends Type<$Shape<T>> {
  typeName: string = '$ShapeType';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    let {type} = this;

    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
      return;
    }

    type = type.unwrap();
    invariant(typeof type.getProperty === 'function', 'Can only $Shape<T> object types.');

    for (const key in input) { // eslint-disable-line guard-for-in
      const property = type.getProperty(key);
      if (!property) {
        continue;
      }
      yield* property.errors(validation, path, input);
    }
  }

  accepts (input: any): boolean {
    let {type} = this;
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    type = type.unwrap();
    invariant(typeof type.getProperty === 'function', 'Can only $Shape<T> object types.');
    for (const key in input) { // eslint-disable-line guard-for-in
      const property = type.getProperty(key);
      if (!property || !property.accepts(input)) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Shape<T>> {
    let {type} = this;
    type = type.unwrap();
    const context = this.context;
    invariant(type instanceof ObjectType, 'Can only $Shape<T> object types.');
    const properties = type.properties;
    const args = new Array(properties.length);
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      args[i] = context.property(property.key, property.value, true);
    }
    return this.context.object(...args);
  }

  toString (): string {
    return `$Shape<${this.type.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}