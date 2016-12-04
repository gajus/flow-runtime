/* @flow */

import Type from './Type';

import ObjectTypeProperty from './ObjectTypeProperty';
import ObjectTypeIndexer from './ObjectTypeIndexer';
import ObjectTypeCallProperty from './ObjectTypeCallProperty';

import type Validation, {IdentifierPath} from '../Validation';

export default class ObjectType<T: Object> extends Type {
  typeName: string = 'ObjectType';
  properties: ObjectTypeProperty<any>[] = [];
  indexers: ObjectTypeIndexer<string | number, any>[] = [];
  callProperties: ObjectTypeCallProperty<any>[] = [];

  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty (key: string): ? ObjectTypeProperty<any> {
    const {properties} = this;
    const {length} = properties;
    for (let i = 0; i < length; i++) {
      const property = properties[i];
      if (property.key === key) {
        return property;
      }
    }
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
    return false;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (input === null) {
      validation.addError(path, 'ERR_EXPECT_OBJECT');
      return true;
    }

    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties) {
      if (!acceptsCallProperties(this, input)) {
        validation.addError(path, 'ERR_EXPECT_CALLABLE');
      }
    }
    else if (typeof input !== 'object') {
      validation.addError(path, 'ERR_EXPECT_OBJECT');
      return true;
    }

    if (this.indexers.length > 0) {
      return collectErrorsWithIndexers(this, validation, path, input);
    }
    else {
      return collectErrorsWithoutIndexers(this, validation, path, input);
    }
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

    if (this.indexers.length > 0) {
      return acceptsWithIndexers(this, input);
    }
    else {
      return acceptsWithoutIndexers(this, input);
    }
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

  makeErrorMessage (): string {
    return 'Invalid object.';
  }

  toString (): string {
    const {callProperties, properties, indexers} = this;
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
    return `{\n${indent(body.join('\n'))}\n}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      callProperties: this.callProperties,
      properties: this.properties,
      indexers: this.indexers
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

function acceptsWithIndexers (type: ObjectType<any>, input: any): boolean {
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
      if (indexer.accepts(key, value)) {
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


function acceptsWithoutIndexers (type: ObjectType<any>, input: any): boolean {
  const {properties} = type;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (!property.accepts(input)) {
      return false;
    }
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


function collectErrorsWithIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: any): boolean {
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
      if (indexer.accepts(key, value)) {
        continue loop;
      }
    }

    // if we got this far the key / value was not accepted by any indexers.
    validation.addError(path.concat(key), 'ERR_NO_INDEXER');
    hasErrors = true;
  }
  return hasErrors;
}


function collectErrorsWithoutIndexers (type: ObjectType<any>, validation: Validation<any>, path: IdentifierPath, input: any): boolean {
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

function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}
