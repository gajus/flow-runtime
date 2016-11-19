/* @flow */

import type TypeContext from './TypeContext';

import invariant from './invariant';

import {Type, ObjectType} from './types';

export default function registerBuiltinTypeHandlers (t: TypeContext): TypeContext {

  // Notes from: http://sitr.us/2015/05/31/advanced-features-in-flow.html
  // and the flow source code.

  // Type of the class whose instances are of type T.
  // This lets you pass around classes as first-class values.
  t.declareTypeHandler({
    name: 'Class',
    typeName: 'ClassType',
    accepts (input, instanceType: Type): boolean {
      if (typeof input !== 'function') {
        return false;
      }
      const expectedType = instanceType.resolve();
      if (input === expectedType) {
        return true;
      }
      if (typeof expectedType === 'function') {
        if (expectedType.prototype.isPrototypeOf(input.prototype)) {
          return true;
        }
        else {
          return false;
        }
      }
      const annotation = t.getAnnotation(input);
      if (annotation) {
        return expectedType.acceptsType(annotation);
      }
      // we're dealing with a type
      switch (input.typeName) {
        case 'NumberType':
        case 'NumericLiteralType':
          return input === Number;
        case 'BooleanType':
        case 'BooleanLiteralType':
          return input === Boolean;
        case 'StringType':
        case 'StringLiteralType':
          return input === String;
        case 'ArrayType':
        case 'TupleType':
          return input === Array;
        default:
          return false;
      }
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });

  // If A and B are object types, $Diff<A,B> is the type of objects that have
  // properties defined in A, but not in B.
  // Properties that are defined in both A and B are allowed too.
  t.declareTypeHandler({
    name: '$Diff',
    typeName: '$DiffType',
    accepts (input, aType: Type, bType: Type): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        return false;
      }
      aType = aType.resolve();
      bType = bType.resolve();
      invariant(aType instanceof ObjectType && bType instanceof ObjectType, "Can only $Diff object types.");
      const properties = aType.properties;
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (bType.hasProperty(property.key)) {
          continue;
        }
        if (!property.accepts(input)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });

  // An object of type $Shape<T> does not have to have all of the properties
  // that type T defines. But the types of the properties that it does have
  // must accepts the types of the same properties in T.
  t.declareTypeHandler({
    name: '$Shape',
    typeName: '$ShapeType',
    accepts (input, shapeType: Type): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        return false;
      }
      shapeType = shapeType.resolve();
      invariant(shapeType instanceof ObjectType, "Can only $Shape<T> object types.");
      for (const key in input) {
        const property = shapeType.getProperty(key);
        if (!property || !property.accepts(input)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });


  // Any, but at least T.
  t.declareTypeHandler({
    name: '$SuperType',
    typeName: '$SuperType',
    accepts (input, superType: Type): boolean {
      return superType.accepts(input);
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });

  // object with larger key set than X's
  t.declareTypeHandler({
    name: '$SubType',
    typeName: '$SubType',
    accepts (input, subType: Type): boolean {
      return subType.accepts(input);
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });


  // The set of keys of T.
  t.declareTypeHandler({
    name: '$Keys',
    typeName: '$KeysType',
    accepts (input, subject: Type): boolean {
      subject = subject.resolve();
      invariant(subject instanceof ObjectType, '$Keys<T> - T must be an ObjectType.');
      const properties = subject.properties;
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (input === property.key) {
          return true;
        }
      }
      return false;
    },
    inferTypeParameters (input: any): Type[] {
      return [];
    }
  });

  t.declareTypeHandler({
    name: 'Date',
    impl: Date,
    typeName: 'DateType',
    accepts (input): boolean {
      return input instanceof Date && !isNaN(input.getTime());
    },
    inferTypeParameters (input: Date): Type[] {
      return [];
    }
  });

  t.declareTypeHandler({
    name: 'Iterable',
    typeName: 'IterableType',
    accepts (input, keyType: Type): boolean {
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
    accepts (input): boolean {
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
    accepts (input, keyType: Type, valueType: Type): boolean {
      if (!(input instanceof Map)) {
        return false;
      }
      for (const [key, value] of input) {
        if (!keyType.accepts(key) || !valueType.accepts(value)) {
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
            if (type.accepts(key)) {
              break findKey;
            }
          }
          keyTypes.push(t.typeOf(key));
        }

        for (let i = 0; i < valueTypes.length; i++) {
          const type = valueTypes[i];
          if (type.accepts(value)) {
            continue loop;
          }
        }
        valueTypes.push(t.typeOf(value));
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
    accepts (input, valueType) {
      if (!(input instanceof Set)) {
        return false;
      }
      for (const value of input) {
        if (!valueType.accepts(value)) {
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
          if (type.accepts(value)) {
            continue loop;
          }
        }
        valueTypes.push(t.typeOf(value));
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