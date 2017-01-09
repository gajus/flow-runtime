/* @flow */
import getErrorMessage from "./getErrorMessage";

import invariant from './invariant';

import {Type, TypeParameterApplication, GenericType, ObjectType} from './types';
import type {FunctionTypeReturn, ObjectTypeProperty} from './types';

import type TypeContext from './TypeContext';
import type Validation, {IdentifierPath} from './Validation';

export default function registerBuiltinTypeConstructors (t: TypeContext): TypeContext {

  // Notes from: http://sitr.us/2015/05/31/advanced-features-in-flow.html
  // and the flow source code.

  // Type of the class whose instances are of type T.
  // This lets you pass around classes as first-class values.
  t.declareTypeConstructor({
    name: 'Class',
    typeName: 'ClassType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, instanceType: Type<any>): boolean {
      if (typeof input !== 'function') {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()));
        return true;
      }
      const expectedType = instanceType.unwrap();
      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (input === expectedType.impl) {
          return false;
        }
        else if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
          return false;
        }
        else {
          validation.addError(path, this, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()));
          return true;
        }
      }
      const annotation = t.getAnnotation(input);
      if (annotation) {
        return expectedType.acceptsType(annotation);
      }
      let matches;
      // we're dealing with a type
      switch (input.typeName) {
        case 'NumberType':
        case 'NumericLiteralType':
          matches = input === Number;
          break;
        case 'BooleanType':
        case 'BooleanLiteralType':
          matches = input === Boolean;
          break;
        case 'StringType':
        case 'StringLiteralType':
          matches = input === String;
          break;
        case 'ArrayType':
        case 'TupleType':
          matches = input === Array;
          break;
        default:
          return false;
      }
      if (matches) {
        return false;
      }
      else {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()));
        return true;
      }
    },
    accepts (input, instanceType: Type<any>): boolean {
      if (typeof input !== 'function') {
        return false;
      }
      let expectedType = instanceType.unwrap();
      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (input === expectedType.impl) {
          return true;
        }
        else if (typeof expectedType.impl === 'function') {
          if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
            return true;
          }
          else {
            return false;
          }
        }
      }

      const annotation = t.getAnnotation(input);

      if (annotation) {
        return expectedType.acceptsType(annotation);
      }
      else if (expectedType instanceof TypeParameterApplication) {
        expectedType = expectedType.parent;
      }

      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
          return true;
        }
        else {
          return false;
        }
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
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  // If A and B are object types, $Diff<A,B> is the type of objects that have
  // properties defined in A, but not in B.
  // Properties that are defined in both A and B are allowed too.
  t.declareTypeConstructor({
    name: '$Diff',
    typeName: '$DiffType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, aType: Type<any>, bType?: Type<any>): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_OBJECT'));
        return true;
      }
      aType = aType.unwrap();
      invariant(bType, "Must specify two type parameters.");
      bType = bType.unwrap();
      invariant(aType instanceof ObjectType && bType instanceof ObjectType, "Can only $Diff object types.");
      let hasErrors = false;
      const properties = aType.properties;
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (bType.hasProperty(property.key)) {
          continue;
        }
        if (property.collectErrors(validation, path.concat(property.key), input)) {
          hasErrors = true;
        }
      }
      return hasErrors;
    },
    accepts (input, aType: Type<any>, bType: Type<any>): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        return false;
      }
      aType = aType.unwrap();
      bType = bType.unwrap();
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
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  // An object of type $Shape<T> does not have to have all of the properties
  // that type T defines. But the types of the properties that it does have
  // must accepts the types of the same properties in T.
  t.declareTypeConstructor({
    name: '$Shape',
    typeName: '$ShapeType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, shapeType: Type<any>): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_OBJECT'));
        return true;
      }
      shapeType = shapeType.unwrap();
      invariant(typeof shapeType.getProperty === 'function', "Can only $Shape<T> object types.");

      let hasErrors = false;
      for (const key in input) { // eslint-disable-line guard-for-in
        const property = shapeType.getProperty(key);
        if (!property) {
          continue;
        }
        if (property.collectErrors(validation, path, input)) {
          hasErrors = true;
        }
      }

      return hasErrors;
    },
    accepts (input, shapeType: Type<any>): boolean {
      if (input === null || (typeof input !== "object" && typeof input !== "function")) {
        return false;
      }
      shapeType = shapeType.unwrap();
      invariant(typeof shapeType.getProperty === 'function', "Can only $Shape<T> object types.");
      for (const key in input) { // eslint-disable-line guard-for-in
        const property = shapeType.getProperty(key);
        if (!property || !property.accepts(input)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });


  // Any, but at least T.
  t.declareTypeConstructor({
    name: '$SuperType',
    typeName: '$SuperType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, superType: Type<any>): boolean {
      return superType.collectErrors(validation, path, input);
    },
    accepts (input, superType: Type<any>): boolean {
      return superType.accepts(input);
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  // object with larger key set than X's
  t.declareTypeConstructor({
    name: '$SubType',
    typeName: '$SubType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, subType: Type<any>): boolean {
      return subType.collectErrors(validation, path, input);
    },
    accepts (input, subType: Type<any>): boolean {
      return subType.accepts(input);
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });


  // map over the key in an object.
  t.declareTypeConstructor({
    name: '$ObjMap',
    typeName: '$ObjMap',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, object: Type<Object>, mapper?: Type<Function>): boolean {
      const target = object.unwrap();
      invariant(mapper, 'Must specify at least two type parameters.');
      invariant(Array.isArray(target.properties), 'Target must be an object type.');


      let hasErrors = false;
      for (const prop: any of target.properties) {
        (prop: ObjectTypeProperty<any, any>);
        const applied: any = mapper.unwrap(
          prop.value.unwrap()
        );
        (applied: FunctionTypeReturn<any>);

        const returnType = applied.returnType.unwrap();
        const value = input[prop.key];
        if (returnType.collectErrors(validation, path.concat(prop.key), value)) {
          hasErrors = true;
        }
      }

      return hasErrors;
    },
    accepts (input, object: Type<Object>, mapper: Type<Function>): boolean {
      const target = object.unwrap();
      invariant(Array.isArray(target.properties), 'Target must be an object type.');

      for (const prop: any of target.properties) {
        (prop: ObjectTypeProperty<any, any>);
        const applied: any = mapper.unwrap(
          prop.value.unwrap()
        );
        (applied: FunctionTypeReturn<any>);

        const returnType = applied.returnType.unwrap();
        if (!returnType.accepts(input[prop.key])) {
          return false;
        }
      }

      return true;
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  // map over the key in an object.
  t.declareTypeConstructor({
    name: '$ObjMapi',
    typeName: '$ObjMapi',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, object: Type<Object>, mapper?: Type<Function>): boolean {
      const target = object.unwrap();
      invariant(mapper, 'Must specify at least two type parameters.');
      invariant(Array.isArray(target.properties), 'Target must be an object type.');

      let hasErrors = false;
      for (const prop: any of target.properties) {
        (prop: ObjectTypeProperty<any, any>);
        const applied: any = mapper.unwrap(
          this.context.string(prop.key),
          prop.value.unwrap()
        );
        (applied: FunctionTypeReturn<any>);

        const value = input[prop.key];
        const returnType = applied.returnType.unwrap();
        if (returnType.collectErrors(validation, path.concat(prop.key), value)) {
          hasErrors = true;
        }
      }

      return hasErrors;
    },
    accepts (input, object: Type<Object>, mapper: Type<Function>): boolean {
      const target = object.unwrap();
      invariant(Array.isArray(target.properties), 'Target must be an object type.');

      for (const prop: any of target.properties) {
        (prop: ObjectTypeProperty<any, any>);
        const applied: any = mapper.unwrap(
          this.context.string(prop.key),
          prop.value.unwrap()
        );
        (applied: FunctionTypeReturn<any>);

        const value = input[prop.key];
        const returnType = applied.returnType.unwrap();
        if (!returnType.accepts(value)) {
          return false;
        }
      }

      return true;
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  // The set of keys of T.
  t.declareTypeConstructor({
    name: '$Keys',
    typeName: '$KeysType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, subject: Type<any>): boolean {
      subject = subject.unwrap();
      invariant(subject instanceof ObjectType, '$Keys<T> - T must be an ObjectType.');
      const properties = subject.properties;
      const length = properties.length;
      for (let i = 0; i < length; i++) {
        const property = properties[i];
        if (input === property.key) {
          return false;
        }
      }
      const keys = new Array(length);
      for (let i = 0; i < length; i++) {
        keys[i] = properties[i].key;
      }
      validation.addError(path, this, getErrorMessage('ERR_NO_UNION', keys.join(' | ')));
      return true;
    },
    accepts (input, subject: Type<any>): boolean {
      subject = subject.unwrap();
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
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Date',
    impl: Date,
    typeName: 'DateType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
      if (!(input instanceof Date)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_INSTANCEOF', Date));
        return true;
      }
      else if (isNaN(input.getTime())) {
        validation.addError(path, this, getErrorMessage('ERR_INVALID_DATE'));
        return true;
      }
      else {
        return false;
      }
    },
    accepts (input): boolean {
      return input instanceof Date && !isNaN(input.getTime());
    },
    inferTypeParameters (input: Date): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Iterable',
    typeName: 'IterableType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, keyType: Type<any>): boolean {
      if (!input) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_OBJECT'));
        return true;
      }
      else if (typeof input[Symbol.iterator] !== 'function') {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_ITERABLE'));
        return true;
      }
      return false;
    },
    accepts (input, keyType: Type<any>): boolean {
      if (!input || typeof input[Symbol.iterator] !== 'function') {
        return false;
      }
      return true;
    },
    inferTypeParameters (input: Iterable<*>): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Promise',
    impl: Promise,
    typeName: 'PromiseType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, futureType: Type<any>): boolean {
      const {context} = this;
      if (!context.checkPredicate('Promise', input)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_PROMISE', futureType));
        return true;
      }
      return false;
    },
    accepts (input): boolean {
      const {context} = this;
      return context.checkPredicate('Promise', input);
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Map',
    impl: Map,
    typeName: 'MapType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, keyType: Type<any>, valueType?: Type<any>): boolean {
      invariant(valueType, "Must specify two type parameters.");
      const {context} = this;
      if (!context.checkPredicate('Map', input)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Map'));
        return true;
      }
      let hasErrors = false;
      for (const [key, value] of input) {
        if (!keyType.accepts(key)) {
          validation.addError(path, this, getErrorMessage('ERR_EXPECT_KEY_TYPE', keyType));
          hasErrors = true;
        }
        if (valueType.collectErrors(validation, path.concat(key), value)) {
          hasErrors = true;
        }
      }
      return hasErrors;
    },
    accepts (input, keyType: Type<any>, valueType: Type<any>): boolean {
      const {context} = this;
      if (!context.checkPredicate('Map', input)) {
        return false;
      }
      for (const [key, value] of input) {
        if (!keyType.accepts(key) || !valueType.accepts(value)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: Map<*, *>): Type<any>[] {
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

  t.declareTypeConstructor({
    name: 'Set',
    impl: Set,
    typeName: 'SetType',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, valueType: Type<any>): boolean {
      const {context} = this;
      if (!context.checkPredicate('Set', input)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Set'));
        return true;
      }
      let hasErrors = false;
      for (const value of input) {
        if (valueType.collectErrors(validation, path, value)) {
          hasErrors = true;
        }
      }
      return hasErrors;
    },
    accepts (input, valueType) {
      const {context} = this;
      if (!context.checkPredicate('Set', input)) {
        return false;
      }
      for (const value of input) {
        if (!valueType.accepts(value)) {
          return false;
        }
      }
      return true;
    },
    inferTypeParameters (input: Set<*>): Type<any>[] {
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


  // Ignores type errors.
  t.declareTypeConstructor({
    name: '$FlowIgnore',
    typeName: '$FlowIgnore',
    collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
      return false;
    },
    accepts (input: any): boolean {
      return true;
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  return t;
}