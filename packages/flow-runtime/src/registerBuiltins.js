/* @flow */
import getErrorMessage from './getErrorMessage';

import invariant from './invariant';

import {Type} from './types';

import type TypeContext from './TypeContext';
import type Validation, {ErrorTuple, IdentifierPath} from './Validation';

export default function registerBuiltinTypeConstructors (t: TypeContext): TypeContext {

  t.declareTypeConstructor({
    name: 'Date',
    impl: Date,
    typeName: 'DateType',
    *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
      if (!(input instanceof Date)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Date'), this];
      }
      else if (isNaN(input.getTime())) {
        yield [path, getErrorMessage('ERR_INVALID_DATE'), this];
      }
    },
    accepts (input): boolean {
      return input instanceof Date && !isNaN(input.getTime());
    },
    compareWith(input) {
      if (input.typeName === 'DateType') {
        return 0;
      }
      return -1;
    },
    inferTypeParameters (input: Date): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Promise',
    impl: Promise,
    typeName: 'PromiseType',
    *errors (validation: Validation<any>, path: IdentifierPath, input: any, futureType?: Type<any>): Generator<ErrorTuple, void, void> {
      invariant(futureType, 'Must specify type parameter for Promise.');
      const {context} = this;
      if (!context.checkPredicate('Promise', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_PROMISE', futureType), this];
      }
    },
    accepts (input): boolean {
      const {context} = this;
      return context.checkPredicate('Promise', input);
    },
    compareWith(input) {
      if (input.typeName === 'PromiseType') {
        return 0;
      }
      return -1;
    },
    inferTypeParameters (input: any): Type<any>[] {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Map',
    impl: Map,
    typeName: 'MapType',
    *errors (validation: Validation<any>, path: IdentifierPath, input: any, keyType?: Type<any>, valueType?: Type<any>): Generator<ErrorTuple, void, void> {
      invariant(keyType, 'Must specify two type parameters for Map.');
      invariant(valueType, 'Must specify two type parameters for Map.');
      const {context} = this;
      if (!context.checkPredicate('Map', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Map'), this];
        return;
      }
      for (const [key, value] of input) {
        if (!keyType.accepts(key)) {
          yield [path, getErrorMessage('ERR_EXPECT_KEY_TYPE', keyType), this];
        }

        yield* valueType.errors(validation, path.concat(key), value);
      }
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
    compareWith(input) {
      if (input.typeName === 'MapType') {
        return 0;
      }
      return -1;
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
    *errors (validation: Validation<any>, path: IdentifierPath, input: any, valueType?: Type<any>): Generator<ErrorTuple, void, void> {
      invariant(valueType, 'Must specify type parameter for Set.');
      const {context} = this;
      if (!context.checkPredicate('Set', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Set'), this];
        return;
      }
      for (const value of input) {
        yield* valueType.errors(validation, path, value);
      }
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
    compareWith(input) {
      if (input.typeName === 'SetType') {
        return 0;
      }
      return -1;
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

  return t;
}