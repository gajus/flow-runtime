/* @flow */

import Type from './Type';

import ObjectTypeProperty from './ObjectTypeProperty';
import ObjectTypeIndexer from './ObjectTypeIndexer';
import ObjectTypeCallProperty from './ObjectTypeCallProperty';

export type Property<K: string | number, V>
 = ObjectTypeProperty<K, V>
 | ObjectTypeIndexer<K, V>
 ;

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

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



  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === null) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_OBJECT'));
      return true;
    }

    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties) {
      if (!acceptsCallProperties(this, input)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_CALLABLE'));
      }
    }
    else if (typeof input !== 'object') {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_OBJECT'));
      return true;
    }
    if (inValidationCycle(this, input)) {
      return false;
    }
    startValidationCycle(this, input);

    let result;

    if (this.indexers.length > 0) {
      result = collectErrorsWithIndexers(this, validation, path, input);
    }
    else if (this.exact) {
      result = collectErrorsExact(this, validation, path, input);
    }
    else {
      result = collectErrorsWithoutIndexers(this, validation, path, input);
    }
    endValidationCycle(this, input);
    return result;
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
    else if (this.exact) {
      result = acceptsExact(this, input);
    }
    else {
      result = acceptsWithoutIndexers(this, input);
    }
    endValidationCycle(this, input);
    return result;
  }

  acceptsType (input: Type<any>): boolean {
    if (!(input instanceof ObjectType)) {
      return false;
    }
    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties && !acceptsTypeCallProperties(this, input)) {
      return false;
    }

    if (this.indexers.length > 0) {
      return acceptsTypeWithIndexers(this, input);
    }
    else {
      return acceptsTypeWithoutIndexers(this, input);
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
  if (typeof input !== 'function') {
    return false;
  }
  const {callProperties} = type;
  for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];
    if (callProperty.accepts(input)) {
      return true;
    }
  }
  return false;
}


function acceptsTypeCallProperties (type: ObjectType<any>, input: ObjectType<any>): boolean {
  const {callProperties} = type;
  const inputCallProperties = input.callProperties;
  loop: for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];

    for (let j = 0; j < inputCallProperties.length; j++) {
      const inputCallProperty = inputCallProperties[j];
      if (callProperty.acceptsType(inputCallProperty)) {
        continue loop;
      }
    }
    // If we got this far, nothing accepted.
    return false;
  }
  return true;
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

function acceptsTypeWithIndexers (type: ObjectType<any>, input: ObjectType<any>): boolean {
  const {indexers, properties} = type;
  const inputIndexers = input.indexers;
  const inputProperties = input.properties;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        if (property.acceptsType(inputProperty)) {
          continue loop;
        }
        else {
          return false;
        }
      }
    }
  }
  loop: for (let i = 0; i < indexers.length; i++) {
    const indexer = indexers[i];
    for (let j = 0; j < inputIndexers.length; j++) {
      const inputIndexer = inputIndexers[j];
      if (indexer.acceptsType(inputIndexer)) {
        continue loop;
      }
    }
    // if we got this far, nothing accepted
    return false;
  }
  return true;
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
  const {length} = properties;
  loop: for (const key in input) { // eslint-disable-line guard-for-in
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        if (!property.accepts(input)) {
          return false;
        }
        continue loop;
      }
    }
    // if we got this far the property does not exist in the object.
    return false;
  }
  return true;
}

function acceptsTypeWithoutIndexers (type: ObjectType<any>, input: ObjectType<any>): boolean {
  const {properties} = type;
  const inputProperties = input.properties;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        if (property.acceptsType(inputProperty)) {
          continue loop;
        }
        else {
          return false;
        }
      }
    }
    return false;
  }
  return true;
}


function collectErrorsWithIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): boolean {
  const {properties, indexers} = type;
  const seen = [];
  let hasErrors = false;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (property.collectErrors(validation, path, input)) {
      hasErrors = true;
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

    // if we got this far the key / value was not accepted by any indexers.
    validation.addError(path.concat(key), type, getErrorMessage('ERR_NO_INDEXER'));
    hasErrors = true;
  }
  return hasErrors;
}


function collectErrorsWithoutIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): boolean {
  const {properties} = type;
  let hasErrors = false;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (property.collectErrors(validation, path, input)) {
      hasErrors = true;
    }
  }
  return hasErrors;
}


function collectErrorsExact (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: Object): boolean {
  const {properties} = type;
  const {length} = properties;
  let hasErrors = false;
  loop: for (const key in input) { // eslint-disable-line guard-for-in
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        if (property.collectErrors(validation, path, input)) {
          hasErrors = true;
        }
        continue loop;
      }
    }
    // if we got this far the property does not exist in the object.
    validation.addError(path, type, getErrorMessage('ERR_UNKNOWN_KEY', key));
    hasErrors = true;
  }
  return hasErrors;
}

function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}
