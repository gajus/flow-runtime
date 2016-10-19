/* @flow */

import {inspect} from 'util';

import type {TypeContext, TypeAcquirer} from './context';

function makeErrorMessage (expected: Type, input: any): string {
  return `Expected ${expected.toString()}, got ${inspect(input)}`;
}

export type TypeConstraint = (input: any) => boolean;

export class Type {
  match (input: any): boolean {
    return false;
  }
  assert <T> (input: T): T {
    if (!this.match(input)) {
      throw new TypeError(makeErrorMessage(this, input));
    }
    return input;
  }
  toString () {
    throw new Error('Not implemented.');
  }
}

export class TypeParameter extends Type {
  id: string;
  bound: ? Type;

  match (input: any): boolean {
    if (!this.bound) {
      return true;
    }
    else {
      return this.bound.match(input);
    }
  }

  toString (withBinding?: boolean): string {
    const {id, bound} = this;
    if (withBinding && bound) {
      return `${id}: ${bound.toString()}`;
    }
    return id;
  }
}

export class TypeParameterApplication extends Type {
  name: string;
  parent: {type: Type};
  constraints: TypeConstraint[];
  typeInstances: Type[] = [];

  match (input: any): boolean {
    const {constraints, parent, typeInstances} = this;
    const {type} = parent;
    if (!type.match(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input, ...typeInstances)) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    const {name, parent, typeInstances} = this;
    const {type} = parent;
    let id;
    if (typeInstances.length) {
      const items = [];
      for (let i = 0; i < typeInstances.length; i++) {
        const typeInstance = typeInstances[i];
        items.push(typeInstance.toString());
      }
      return `${name}<${items.join(', ')}>`;
    }
    else {
      return name;
    }
  }
}

export class TypeReference extends Type {
  name: string;
  acquirer: TypeContext | TypeAcquirer;

  match (input: any): boolean {
    const {acquirer, name} = this;
    let type;
    if (typeof acquirer === 'function') {
      type = acquirer(name);
    }
    else {
      type = acquirer.get(name);
    }
    if (!type) {
      throw new ReferenceError(`Cannot find a type called ${name}`);
    }
    return type.match(input);
  }

  toString (): string {
    return this.name;
  }
}

export class NamedType extends Type {
  name: string;
  type: Type;
  constraints: TypeConstraint[] = [];
  typeParameters: TypeParameter[] = [];

  typeParameter (id: string, bound?: Type): TypeParameter {
    const target = new TypeParameter();
    target.id = id;
    target.bound = bound;
    this.typeParameters.push(target);
    return target;
  }

  addConstraint (constraint: TypeConstraint): NamedType {
    this.constraints.push(constraint);
    return this;
  }

  match (input: any): boolean {
    const {constraints, type, typeParameters} = this;
    if (!type.match(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input, ...typeParameters)) {
        return false;
      }
    }
    return true;
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication();
    target.name = this.name;
    target.parent = this;
    target.typeInstances = typeInstances;
    target.constraints = this.constraints;
    return target;
  }

  toString (): string {
    const {name, type, typeParameters} = this;
    let id;
    if (typeParameters.length) {
      const items = [];
      for (let i = 0; i < typeParameters.length; i++) {
        const typeParameter = typeParameters[i];
        items.push(typeParameter.toString(true));
      }
      id = `${name}<${items.join(', ')}>`;
    }
    else {
      id = name;
    }
    return `type ${id} = ${type.toString()};`;
  }
}

export class TypeHandler extends Type {
  name: string;
  impl: Function;
  typeInstances: Type[] = [];

  match (input: any): boolean {
    throw new Error(`No matcher for ${this.name}.`);
  }

  toString (): string {
    const {name, typeInstances} = this;
    if (typeInstances.length) {
      const items = [];
      for (let i = 0; i < typeInstances.length; i++) {
        const typeInstance = typeInstances[i];
        items.push(typeInstance.toString());
      }
      return `${name}<${items.join(', ')}>`;
    }
    else {
      return name;
    }
  }
}


export class NullLiteralType extends Type {
  match (input: any): boolean {
    return input === null;
  }

  toString (): string {
    return 'null';
  }
}

export class NumberType extends Type {
  match (input: any): boolean {
    return typeof input === 'number';
  }

  toString (): string {
    return 'number';
  }
}

export class NumericLiteralType extends Type {
  value: number;
  match (input: any): boolean {
    return input === this.value;
  }

  toString (): string {
    return `${this.value}`;
  }
}

export class BooleanType extends Type {
  match (input: any): boolean {
    return typeof input === 'boolean';
  }

  toString () {
    return 'boolean';
  }
}


export class BooleanLiteralType extends Type {
  value: boolean;
  match (input: any): boolean {
    return input === this.value;
  }

  toString (): string {
    return this.value ? 'true' : 'false';
  }
}

export class SymbolType extends Type {
  match (input: any): boolean {
    return typeof input === 'symbol';
  }

  toString () {
    return 'Symbol';
  }
}

export class StringType extends Type {
  match (input: any): boolean {
    return typeof input === 'string';
  }

  toString () {
    return 'string';
  }
}


export class StringLiteralType extends Type {
  value: string;
  match (input: any): boolean {
    return input === this.value;
  }

  toString (): string {
    return JSON.stringify(this.value);
  }
}

export class ArrayType extends Type {
  elementType: Type;
  match (input: any): boolean {
    if (!Array.isArray(input)) {
      return false;
    }
    const {elementType} = this;
    const {length} = input;
    for (let i = 0; i < length; i++) {
      if (!elementType.match(input[i])) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    return `Array<${this.elementType.toString()}>`;
  }
}

export class ObjectType extends Type {
  properties: ObjectTypeProperty[] = [];
  indexers: ObjectTypeIndexer[] = [];
  callProperties: ObjectTypeCallProperty[] = [];

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


export class ObjectTypeCallProperty extends Type {
  value: Type;
  match (input: any): boolean {
    return this.value.match(input);
  }

  toString (): string {
    return `${this.value.toString()};`;
  }
}

export class ObjectTypeIndexer extends Type {
  id: string;
  key: Type;
  value: Type;

  match (key: any, value: any): boolean {
    return this.key.match(key) && this.value.match(value);
  }

  toString (): string {
    return `[${this.id}: ${this.key.toString()}]: ${this.value.toString()};`;
  }
}

export class ObjectTypeProperty extends Type {
  key: string;
  value: Type;
  optional: boolean;

  match (input: Object): boolean {
    if (this.optional && input[this.key] === undefined) {
      return true;
    }
    return this.value.match(input[this.key]);
  }

  toString (): string {
    return `${this.key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
  }
}

export class FunctionType extends Type {
  typeParameters: TypeParameter[] = [];
  params: FunctionTypeParam[] = [];
  rest: ? FunctionTypeRestParam;
  returnType: Type;

  match (input: any): boolean {
    if (typeof input !== 'function') {
      return false;
    }
    const {params} = this;
    if (params.length > input.length) {
      // function might not have enough parameters,
      // see how many are really required.
      let needed = 0;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (!param.optional) {
          needed++;
        }
      }
      if (needed > input.length) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    const {typeParameters, params, rest, returnType} = this;
    const hasTypeParameters = typeParameters.length > 0;
    let intro = '';
    if (hasTypeParameters) {
      const items = [];
      for (let i = 0; i < typeParameters.length; i++) {
        const typeParameter = typeParameters[i];
        items.push(typeParameter.toString(true));
      }
      intro = `<${items.join(', ')}> `;
    }
    const args = [];
    for (let i = 0; i < params.length; i++) {
      args.push(params[i].toString());
    }
    if (rest) {
      args.push(rest.toString());
    }
    return `${intro}(${args.join(', ')}) => ${returnType.toString()}`;
  }
}

export class FunctionTypeParam extends Type {
  name: string;
  optional: boolean;
  type: Type;

  match (input: any): boolean {
    const {optional, type} = this;
    if (optional && input === undefined) {
      return true;
    }
    else {
      return type.match(input);
    }
  }

  toString (): string {
    const {optional, type} = this;
    return `${this.name}${optional ? '?' : ''}: ${type.toString()}`;
  }
}

export class FunctionTypeRestParam extends Type {
  name: string;
  type: Type;

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  toString (): string {
    const {type} = this;
    return `...${this.name}: ${type.toString()}`;
  }
}

export class FunctionTypeReturn extends Type {
  type: Type;

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  toString (): string {
    const {type} = this;
    return type.toString();
  }
}

export class GenericType extends Type {
  name: string;
  impl: any;
  typeInstances: Type[] = [];

  match (input: any): boolean {
    return input instanceof this.impl;
  }

  toString (): string {
    const {name, typeInstances} = this;
    if (typeInstances.length > 0) {
      const items = [];
      for (let i = 0; i < typeInstances.length; i++) {
        const typeInstance = typeInstances[i];
        items.push(typeInstance.toString());
      }
      return `${name}<${items.join(', ')}>`;
    }
    else {
      return name;
    }
  }
}

export class ExistentialType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return '*';
  }
}

export class AnyType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'any';
  }
}

export class MixedType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'mixed';
  }
}


export class EmptyType extends Type {
  match (input: any): boolean {
    return false; // empty types match nothing.
  }

  toString (): string {
    return 'empty';
  }
}

export class NullableType extends Type {
  type: Type;
  match (input: any): boolean {
    if (input == null) {
      return true;
    }
    else {
      return this.type.match(input);
    }
  }

  toString (): string {
    return `? ${this.type.toString()}`;
  }
}

export class TupleType extends Type {
  types: Type[] = [];

  match (input: any): boolean {
    const {types} = this;
    const {length} = types;
    if (!Array.isArray(input) || input.length < length) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.match(input[i])) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    return `[${this.types.join(', ')}]`;
  }
}

export class UnionType extends Type {
  types: Type[] = [];

  match (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (type.match(input)) {
        return true;
      }
    }
    return false;
  }

  toString (): string {
    return this.types.join(' | ');
  }
}


export class IntersectionType extends Type {
  types: Type[] = [];

  match (input: any): boolean {
    const {types} = this;
    const {length} = types;
    for (let i = 0; i < length; i++) {
      const type = types[i];
      if (!type.match(input)) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    return this.types.join(' & ');
  }
}

export class VoidType extends Type {
  match (input: any): boolean {
    return input === undefined;
  }

  toString (): string {
    return 'void';
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

