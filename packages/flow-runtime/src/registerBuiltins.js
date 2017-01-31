/* @flow */
import getErrorMessage from './getErrorMessage';

import invariant from './invariant';

import {Type} from './types';

import type TypeContext from './TypeContext';
import type Validation, {IdentifierPath} from './Validation';

export default function registerBuiltinTypeConstructors (t: TypeContext): TypeContext {

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
      invariant(valueType, 'Must specify two type parameters.');
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

  return t;
}