/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import invariant from '../invariant';

import ObjectType from './ObjectType';
import type {Property} from './ObjectType';
import type ObjectTypeProperty from './ObjectTypeProperty';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class IntersectionType<T: {}> extends Type {
  typeName: string = 'IntersectionType';
  types: Type<T>[] = [];

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      yield* types[i].errors(validation, path, input);
    }
  }

  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty <K: string | number> (key: K): ? Property<K, any> {
    const {types} = this;
    const {length} = types;
    for (let i = length - 1; i >= 0; i--) {
      const type = types[i];
      if (typeof type.getProperty === 'function') {
        const prop = type.getProperty(key);
        if (prop) {
          return prop;
        }
      }
    }
  }

  /**
   * Determine whether a property with the given name exists.
   */
  hasProperty (key: string): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (typeof type.hasProperty === 'function' && type.hasProperty(key)) {
        return true;
      }
    }
    return false;
  }

  accepts (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.accepts(input)) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const types = this.types;
    let identicalCount = 0;
    if (input instanceof IntersectionType) {
      const inputTypes = input.types;
      loop: for (let i = 0; i < types.length; i++) {
        const type = types[i];
        for (let j = 0; j < inputTypes.length; j++) {
          const result = compareTypes(type, inputTypes[i]);
          if (result === 0) {
            identicalCount++;
            continue loop;
          }
          else if (result === 1) {
            continue loop;
          }
        }
        // if we got this far then nothing accepted this type.
        return -1;
      }
      return identicalCount === types.length ? 0 : 1;
    }
    else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const result = compareTypes(type, input);
        if (result === -1) {
          return -1;
        }
        else if (result === 0) {
          identicalCount++;
        }
      }
      return identicalCount === types.length ? 0 : 1;
    }
  }

  unwrap (): ObjectType<T> {
    const callProperties = [];
    const properties = [];
    const indexers = [];
    const {types, context} = this;
    for (let i = 0; i < types.length; i++) {
      const type = types[i].unwrap();
      invariant(type instanceof ObjectType, 'Can only intersect object types');
      callProperties.push(...type.callProperties);
      indexers.push(...type.indexers);
      mergeProperties(properties, type.properties);
    }
    return (context: any).object(
      ...callProperties,
      ...properties,
      ...indexers
    );
  }

  toString (): string {
    return this.types.join(' & ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}

function getPropertyIndex <K: string | number, V> (name: K, properties: ObjectTypeProperty<*, V>[]): number {
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].name === name) {
      return i;
    }
  }
  return -1;
}

function mergeProperties <K: string | number, V> (target: ObjectTypeProperty<K, V>[], source: ObjectTypeProperty<K, V>[]): ObjectTypeProperty<K, V>[] {
  for (let i = 0; i < source.length; i++) {
    const typeProp = source[i];
    const index = getPropertyIndex(typeProp.key, target);
    if (index === -1) {
      target.push(typeProp);
    }
    else {
      target[index] = typeProp;
    }
  }
  return target;
}
