/* @flow */

import type TypeContext from './TypeContext';

import type {
  Type
} from './types';

export default function registerBuiltinTypeHandlers (t: TypeContext): TypeContext {

  t.declareTypeHandler({
    name: 'Date',
    impl: Date,
    typeName: 'DateType',
    match (input): boolean {
      return input instanceof Date && !isNaN(input.getTime());
    },
    inferTypeParameters (input: Date): Type[] {
      return [];
    }
  });

  t.declareTypeHandler({
    name: 'Iterable',
    typeName: 'IterableType',
    match (input, keyType: Type): boolean {
      if (!input || typeof input[Symbol.iterator] !== 'function') {
        return false;
      }
      return true;
    },
    inferTypeParameters (input: Iterable<*>): Type[] {
      return [];
    }
  });

  t.declareTypeHandler({
    name: 'Promise',
    impl: Promise,
    typeName: 'PromiseType',
    match (input): boolean {
      return input && typeof input.then === 'function' && input.then.length > 1;
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });

  t.declareTypeHandler({
    name: 'Map',
    impl: Map,
    typeName: 'MapType',
    match (input, keyType: Type, valueType: Type): boolean {
      if (!(input instanceof Map)) {
        return false;
      }
      for (const [key, value] of input) {
        if (!keyType.match(key) || !valueType.match(value)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: Map<*, *>): Type[] {
      const keyTypes = [];
      const valueTypes = [];
      loop: for (const [key, value] of input) {
        findKey: {
          for (let i = 0; i < keyTypes.length; i++) {
            const type = keyTypes[i];
            if (type.match(key)) {
              break findKey;
            }
          }
          keyTypes.push(t.infer(key));
        }

        for (let i = 0; i < valueTypes.length; i++) {
          const type = valueTypes[i];
          if (type.match(value)) {
            continue loop;
          }
        }
        valueTypes.push(t.infer(value));
      }
      const typeInstances = [];

      if (keyTypes.length === 0) {
        typeInstances.push(t.existential());
      }
      else if (keyTypes.length === 1) {
        typeInstances.push(keyTypes[0]);
      }
      else {
        typeInstances.push(t.union(...keyTypes));
      }

      if (valueTypes.length === 0) {
        typeInstances.push(t.existential());
      }
      else if (valueTypes.length === 1) {
        typeInstances.push(valueTypes[0]);
      }
      else {
        typeInstances.push(t.union(...valueTypes));
      }

      return typeInstances;
    }
  });

  t.declareTypeHandler({
    name: 'Set',
    impl: Set,
    typeName: 'SetType',
    match (input, valueType) {
      if (!(input instanceof Set)) {
        return false;
      }
      for (const value of input) {
        if (!valueType.match(value)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: Set<*>): Type[] {
      const valueTypes = [];
      loop: for (const value of input) {
        for (let i = 0; i < valueTypes.length; i++) {
          const type = valueTypes[i];
          if (type.match(value)) {
            continue loop;
          }
        }
        valueTypes.push(t.infer(value));
      }
      if (valueTypes.length === 0) {
        return [t.existential()];
      }
      else if (valueTypes.length === 1) {
        return [valueTypes[0]];
      }
      else {
        return [t.union(...valueTypes)];
      }
    }
  });


  return t;
}