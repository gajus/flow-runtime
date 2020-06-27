/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import ObjectTypeProperty from './ObjectTypeProperty';
import ObjectTypeIndexer from './ObjectTypeIndexer';
import ObjectTypeCallProperty from './ObjectTypeCallProperty';

import {ClassDeclaration, ParameterizedClassDeclaration} from '../declarations';

export type Property<K: string | number, V>
 = ObjectTypeProperty<K, V>
 | ObjectTypeIndexer<K, V>
 ;

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import {
  inValidationCycle,
  startValidationCycle,
  endValidationCycle,
  inToStringCycle,
  startToStringCycle,
  endToStringCycle
} from '../cyclic';


export default class ObjectType<T: {}> extends Type {
  typeName: string = 'ObjectType';
  properties: ObjectTypeProperty<$Keys<T>, any>[] = [];
  indexers: ObjectTypeIndexer<any, any>[] = [];
  callProperties: ObjectTypeCallProperty<any>[] = [];
  exact: boolean = false;

  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty (key: string | number): ? Property<$Keys<T>, any> {
    const {properties} = this;
    const {length} = properties;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        return property;
      }
    }
    return this.getIndexer(key);
  }

  setProperty (key: string | number, value: Type<*>, optional: boolean = false) {
    const { context, properties } = this;
    const { length } = properties;
    const newProp = new ObjectTypeProperty(context);
    newProp.key = key;
    newProp.value = value;
    newProp.optional = optional;

    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        properties[i] = newProp;
        return;
      }
    }
    properties.push(newProp);
  }

  /**
   * Determine whether a property with the given name exists.
   */
  hasProperty (key: string): boolean {
    const {properties} = this;
    const {length} = properties;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        return true;
      }
    }
    return this.hasIndexer(key);
  }


  /**
   * Get an indexer with which matches the given key type.
   */
  getIndexer <K: string | number> (key: K): ? ObjectTypeIndexer<K, any> {
    const {indexers} = this;
    const {length} = indexers;
    for (let i = 0; i < length; i++) {
      const indexer = indexers[i];
      if (indexer.acceptsKey(key)) {
        return indexer;
      }
    }
  }

  /**
   * Determine whether an indexer exists which matches the given key type.
   */
  hasIndexer (key: string | number): boolean {
    const {indexers} = this;
    const {length} = indexers;
    for (let i = 0; i < length; i++) {
      const indexer = indexers[i];
      if (indexer.acceptsKey(key)) {
        return true;
      }
    }
    return false;
  }



  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (input === null) {
      yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
      return;
    }

    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties) {
      if (!acceptsCallProperties(this, input)) {
        yield [path, getErrorMessage('ERR_EXPECT_CALLABLE'), this];
      }
    }
    else if (typeof input !== 'object') {
      yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
      return;
    }

    if (validation.inCycle(this, input)) {
      return;
    }
    validation.startCycle(this, input);


    if (this.indexers.length > 0) {
      if (input instanceof Object && Array.isArray(input)) {
        yield[path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }
      yield* collectErrorsWithIndexers(this, validation, path, input);
    }
    else {
      yield* collectErrorsWithoutIndexers(this, validation, path, input);

      // exact with indexer is same as non-exact
      if (this.exact) {
        yield* collectErrorsExact(this, validation, path, input);
      }
    }
    validation.endCycle(this, input);
  }

  accepts (input: any): boolean {
    if (input === null) {
      return false;
    }
    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties) {
      if (!acceptsCallProperties(this, input)) {
        return false;
      }
    }
    else if (typeof input !== 'object') {
      return false;
    }
    if (inValidationCycle(this, input)) {
      return true;
    }
    startValidationCycle(this, input);

    let result;
    if (this.indexers.length > 0) {
      result = acceptsWithIndexers(this, input);
    }
    else {
      result = acceptsWithoutIndexers(this, input);
    }
    if (result && this.exact) {
      result = acceptsExact(this, input);
    }
    endValidationCycle(this, input);
    return result;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof ObjectType || input instanceof ClassDeclaration || input instanceof ParameterizedClassDeclaration)) {
      return -1;
    }
    const hasCallProperties = this.callProperties.length > 0;

    let isGreater = false;
    if (hasCallProperties) {
      const result = compareTypeCallProperties(this, (input: $FlowFixme));
      if (result === -1) {
        return -1;
      }
      else if (result === 1) {
        isGreater = true;
      }
    }

    let result;
    if (this.indexers.length > 0) {
      result = compareTypeWithIndexers(this, (input: $FlowFixme));
    }
    else {
      result = compareTypeWithoutIndexers(this, (input: $FlowFixme));
    }

    if (result === -1) {
      return -1;
    }
    else if (isGreater) {
      return 1;
    }
    else {
      return result;
    }
  }

  toString (): string {
    const {callProperties, properties, indexers} = this;
    if (inToStringCycle(this)) {
      return '$Cycle<Object>';
    }
    startToStringCycle(this);
    const body = [];
    for (let i = 0; i < callProperties.length; i++) {
      body.push(callProperties[i].toString());
    }
    for (let i = 0; i < properties.length; i++) {
      body.push(properties[i].toString());
    }
    for (let i = 0; i < indexers.length; i++) {
      body.push(indexers[i].toString());
    }
    endToStringCycle(this);
    if (this.exact) {
      return `{|\n${indent(body.join('\n'))}\n|}`;
    }
    else {
      return `{\n${indent(body.join('\n'))}\n}`;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      callProperties: this.callProperties,
      properties: this.properties,
      indexers: this.indexers,
      exact: this.exact
    };
  }
}

function acceptsCallProperties (type: ObjectType<any>, input: any): boolean {
  const {callProperties} = type;
  for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];
    if (callProperty.accepts(input)) {
      return true;
    }
  }
  return false;
}


function compareTypeCallProperties (type: ObjectType<any>, input: ObjectType<any>): -1 | 0 | 1 {
  const {callProperties} = type;
  const inputCallProperties = input.callProperties;
  let identicalCount = 0;
  loop: for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];

    for (let j = 0; j < inputCallProperties.length; j++) {
      const inputCallProperty = inputCallProperties[j];
      const result = compareTypes(callProperty, inputCallProperty);
      if (result === 0) {
        identicalCount++;
        continue loop;
      }
      else if (result === 1) {
        continue loop;
      }
    }
    // If we got this far, nothing accepted.
    return -1;
  }
  if (identicalCount === callProperties.length) {
    return 0;
  }
  else {
    return 1;
  }
}

function acceptsWithIndexers (type: ObjectType<any>, input: Object): boolean {
  const {properties, indexers} = type;
  const seen = [];
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (!property.accepts(input)) {
      return false;
    }
    seen.push(property.key);
  }
  loop: for (const key in input) {
    if (seen.indexOf(key) !== -1) {
      continue;
    }
    const value = input[key];
    for (let i = 0; i < indexers.length; i++) {
      const indexer = indexers[i];
      if (indexer.acceptsKey(key) && indexer.acceptsValue(value)) {
        continue loop;
      }
    }

    // if we got this far the key / value did not accepts any indexers.
    return false;
  }
  return true;
}

function compareTypeWithIndexers (type: ObjectType<any>, input: ObjectType<any>): -1 | 0 | 1 {
  const {indexers, properties} = type;
  const inputIndexers = input.indexers;
  const inputProperties = input.properties;
  let isGreater = false;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        const result = compareTypes(property, inputProperty);
        if (result === -1) {
          return -1;
        }
        else if (result === 1) {
          isGreater = true;
        }
        continue loop;
      }
    }
  }
  loop: for (let i = 0; i < indexers.length; i++) {
    const indexer = indexers[i];
    for (let j = 0; j < inputIndexers.length; j++) {
      const inputIndexer = inputIndexers[j];
      const result = compareTypes(indexer, inputIndexer);
      if (result === 1) {
        isGreater = true;
        continue loop;
      }
      else if (result === 0) {
        continue loop;
      }
    }
    // if we got this far, nothing accepted
    return -1;
  }
  return isGreater ? 1 : 0;
}


function acceptsWithoutIndexers (type: ObjectType<any>, input: Object): boolean {
  const {properties} = type;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (!property.accepts(input)) {
      return false;
    }
  }
  return true;
}

function acceptsExact (type: ObjectType<any>, input: Object): boolean {
  const {properties} = type;
  for (const key in input) { // eslint-disable-line guard-for-in
    if (!properties.some(property => property.key === key)) {
      return false;
    }
  }
  return true;
}

function compareTypeWithoutIndexers (type: ObjectType<any>, input: ObjectType<any>): -1 | 0 | 1 {
  const {properties} = type;
  const inputProperties = input.properties;
  let isGreater = false;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        const result = compareTypes(property.value, inputProperty.value);
        if (result === -1) {
          return -1;
        }
        else if (result === 1) {
          isGreater = true;
        }
        continue loop;
      }
    }
    return -1;
  }
  return isGreater ? 1 : 0;
}


function *collectErrorsWithIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): Generator<ErrorTuple, void, void> {
  const {properties, indexers} = type;
  const seen = [];
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    yield* property.errors(validation, path, input);
    seen.push(property.key);
  }
  loop: for (const key in input) {
    if (seen.indexOf(key) !== -1) {
      continue;
    }
    const value = input[key];
    for (let i = 0; i < indexers.length; i++) {
      const indexer = indexers[i];
      if (indexer.acceptsKey(key) && indexer.acceptsValue(value)) {
        continue loop;
      }
    }

    // if we got this far the key / value was not accepted by any indexers.
    yield [path.concat(key), getErrorMessage('ERR_NO_INDEXER'), type];
  }
}


function *collectErrorsWithoutIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): Generator<ErrorTuple, void, void> {
  const {properties} = type;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    yield* property.errors(validation, path, input);
  }
}


function *collectErrorsExact (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): Generator<ErrorTuple, void, void> {
  const {properties} = type;
  for (const key in input) { // eslint-disable-line guard-for-in
    if (!properties.some(property => property.key === key)) {
      yield [path, getErrorMessage('ERR_UNKNOWN_KEY', key), type];
    }
  }
}

function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}
