/* @flow */

import type TypeContext from './TypeContext';

import type {
  Type,
  TypeHandler
} from './types';

export default function registerBuiltinTypeHandlers (t: TypeContext): TypeContext {

  t.declareTypeHandler('Date', Date, {
    match: (input): boolean => {
      return input instanceof Date && !isNaN(input.getTime());
    },
    infer: (Handler: Class<TypeHandler>, input: any): Type => {
      return new Handler(t);
    }
  });

  t.declareTypeHandler('Promise', Promise, {
    match: (input): boolean => {
      return input && typeof input.then === 'function' && input.then.length > 1;
    },
    infer: (Handler: Class<TypeHandler>, input: any): Type => {
      return new Handler(t);
    }
  });

  t.declareTypeHandler('Map', Map, {
    match: (input, keyType: Type, valueType: Type): boolean => {
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
    infer: (Handler: Class<TypeHandler>, input: Map<*, *>): Type => {
      const target = new Handler(t);
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
      if (keyTypes.length === 0) {
        target.typeInstances.push(t.existential());
      }
      else if (keyTypes.length === 1) {
        target.typeInstances.push(keyTypes[0]);
      }
      else {
        target.typeInstances.push(t.union(...keyTypes));
      }
      if (valueTypes.length === 0) {
        target.typeInstances.push(t.existential());
      }
      else if (valueTypes.length === 1) {
        target.typeInstances.push(valueTypes[0]);
      }
      else {
        target.typeInstances.push(t.union(...valueTypes));
      }
      return target;
    }
  });

  t.declareTypeHandler('Set', Set, {
    match: (input, valueType) => {
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
    infer (Handler: Class<TypeHandler>, input: Set<*>): Type {
      const target = new Handler(t);
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
        target.typeInstances.push(t.existential());
      }
      else if (valueTypes.length === 1) {
        target.typeInstances.push(valueTypes[0]);
      }
      else {
        target.typeInstances.push(t.union(...valueTypes));
      }
      return target;
    }
  });


  return t;
}