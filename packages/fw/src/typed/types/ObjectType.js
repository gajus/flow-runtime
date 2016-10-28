/* @flow */

import Type from './Type';

import ObjectTypeProperty from './ObjectTypeProperty';
import ObjectTypeIndexer from './ObjectTypeIndexer';
import ObjectTypeCallProperty from './ObjectTypeCallProperty';

export default class ObjectType extends Type {
  typeName: string = 'ObjectType';
  properties: ObjectTypeProperty[] = [];
  indexers: ObjectTypeIndexer[] = [];
  callProperties: ObjectTypeCallProperty[] = [];

  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty (key: string): ? ObjectTypeProperty {
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



  match (input: any): boolean {
    if (input === null) {
      return false;
    }
    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties) {
      if (!matchCallProperties(this, input)) {
        return false;
      }
    }
    else if (typeof input !== 'object') {
      return false;
    }

    if (this.indexers.length > 0) {
      return matchWithIndexers(this, input);
    }
    else {
      return matchWithoutIndexers(this, input);
    }
  }

  matchType (input: Type): boolean {
    if (!(input instanceof ObjectType)) {
      return false;
    }
    const hasCallProperties = this.callProperties.length > 0;

    if (hasCallProperties && !matchTypeCallProperties(this, input)) {
      return false;
    }

    if (this.indexers.length > 0) {
      return matchTypeWithIndexers(this, input);
    }
    else {
      return matchTypeWithoutIndexers(this, input);
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

function matchCallProperties (type: ObjectType, input: any): boolean {
  if (typeof input !== 'function') {
    return false;
  }
  const {callProperties} = type;
  for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];
    if (callProperty.match(input)) {
      return true;
    }
  }
  return false;
}


function matchTypeCallProperties (type: ObjectType, input: ObjectType): boolean {
  const {callProperties} = type;
  const inputCallProperties = input.callProperties;
  loop: for (let i = 0; i < callProperties.length; i++) {
    const callProperty = callProperties[i];

    for (let j = 0; j < inputCallProperties.length; j++) {
      const inputCallProperty = inputCallProperties[j];
      if (callProperty.matchType(inputCallProperty)) {
        continue loop;
      }
    }
    // If we got this far, nothing matched.
    return false;
  }
  return true;
}

function matchWithIndexers (type: ObjectType, input: any): boolean {
  const {properties, indexers} = type;
  const seen = [];
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (!property.match(input)) {
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
      if (indexer.match(key, value)) {
        continue loop;
      }
    }

    // if we got this far the key / value did not match any indexers.
    return false;
  }
  return true;
}

function matchTypeWithIndexers (type: ObjectType, input: ObjectType): boolean {
  const {indexers, properties} = type;
  const inputIndexers = input.indexers;
  const inputProperties = input.properties;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        if (property.matchType(inputProperty)) {
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
      if (indexer.matchType(inputIndexer)) {
        continue loop;
      }
    }
    // if we got this far, nothing matched
    return false;
  }
  return true;
}


function matchWithoutIndexers (type: ObjectType, input: any): boolean {
  const {properties} = type;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (!property.match(input)) {
      return false;
    }
  }
  return true;
}

function matchTypeWithoutIndexers (type: ObjectType, input: ObjectType): boolean {
  const {properties} = type;
  const inputProperties = input.properties;
  loop: for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    for (let j = 0; j < inputProperties.length; j++) {
      const inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        if (property.matchType(inputProperty)) {
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


function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}
