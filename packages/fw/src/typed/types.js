/* @flow */

import {inspect} from 'util';

import type TypeContext, {TypeAcquirer} from './TypeContext';


export type TypeCreator <T: Type> = (partial: PartialType<T>) => T;
export type FunctionBodyCreator <T: FunctionType> = (partial: PartialType<T>) => Array<FunctionTypeParam | FunctionTypeRestParam | FunctionTypeReturn>;

export type TypeConstraint = (input: any) => boolean;

const RecordedType = Symbol('RecordedType');

export class Type {
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

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
  toJSON () {
    return {};
  }
}

export class TypeParameter extends Type {
  id: string;
  bound: ? Type;

  // @flowIssue 252
  [RecordedType]: ? Type;

  match (input: any): boolean {
    // @flowIssue 252
    const recorded = this[RecordedType];
    if (recorded) {
      return recorded.match(input);
    }

    const {bound, context} = this;

    if (bound && !bound.match(input)) {
      return false;
    }
    const inferred = context.infer(input);

    // @flowIssue 252
    this[RecordedType] = inferred;

    return true;
  }

  toString (withBinding?: boolean): string {
    const {id, bound} = this;
    if (withBinding && bound) {
      return `${id}: ${bound.toString()}`;
    }
    return id;
  }

  toJSON () {
    return {
      '@type': 'TypeParameter',
      id: this.id,
      bound: this.bound
    };
  }
}

export class TypeParameterApplication extends Type {
  parent: NamedType | PartialType<*>;
  constraints: TypeConstraint[] = [];
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
    const {parent, typeInstances} = this;
    const {name} = parent;
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

  toJSON () {
    return {
      '@type': 'TypeParameterApplication',
      name: this.parent.name,
      typeInstances: this.typeInstances
    };
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


  toJSON () {
    return {
      '@type': 'TypeReference',
      name: this.name
    };
  }
}


export class PartialType<T: Type> extends Type {
  name: string;
  type: T;
  typeParameters: TypeParameter[] = [];

  typeParameter (id: string, bound?: Type): TypeParameter {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    this.typeParameters.push(target);
    return target;
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  toString (): string {
    const {type} = this;
    return type.toString();
  }

  toJSON () {
    return {
      '@type': 'PartialType',
      typeParameters: this.typeParameters,
      type: this.type
    };
  }
}


export class NamedType extends Type {
  name: string;
  type: Type;
  constraints: TypeConstraint[] = [];

  addConstraint (constraint: TypeConstraint): NamedType {
    this.constraints.push(constraint);
    return this;
  }

  match (input: any): boolean {
    const {constraints, type} = this;
    if (!type.match(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        return false;
      }
    }
    return true;
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    target.constraints = this.constraints;
    return target;
  }

  toString (): string {
    const {name, type} = this;
    return `type ${name} = ${type.toString()};`;
  }

  toJSON () {
    return {
      '@type': 'NamedType',
      name: this.name,
      type: this.type
    };
  }
}



export class ParameterizedNamedType <T: Type> extends NamedType {

  typeCreator: TypeCreator<T>;

  get partial (): PartialType<T> {
    const {typeCreator, name} = this;
    const target = new PartialType(this.context);
    target.name = name;
    target.type = typeCreator(target);
    return target;
  }

  match (input: any): boolean {
    const {constraints, partial} = this;
    if (!partial.match(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        return false;
      }
    }
    return true;
  }

  toString (): string {
    const {name, partial} = this;
    const {typeParameters} = partial;
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
    return `type ${name}<${items.join(', ')}> = ${partial.toString()};`;
  }

  toJSON () {
    const {partial} = this;
    return partial.toJSON();
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

  toJSON () {
    return {
      '@type': 'TypeHandler',
      name: this.name
    };
  }

  static infer (input: any): Type {
    throw new Error('Invalid invocation.');
  }
}


export class NullLiteralType extends Type {
  match (input: any): boolean {
    return input === null;
  }

  toString (): string {
    return 'null';
  }

  toJSON () {
    return {
      '@type': 'NullLiteralType'
    };
  }
}

export class NumberType extends Type {
  match (input: any): boolean {
    return typeof input === 'number';
  }

  toString (): string {
    return 'number';
  }

  toJSON () {
    return {
      '@type': 'NumberType'
    };
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

  toJSON () {
    return {
      '@type': 'NumericLiteralType',
      value: this.value
    };
  }
}

export class BooleanType extends Type {
  match (input: any): boolean {
    return typeof input === 'boolean';
  }

  toString () {
    return 'boolean';
  }

  toJSON () {
    return {
      '@type': 'BooleanType'
    };
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

  toJSON () {
    return {
      '@type': 'BooleanLiteralType',
      value: this.value
    };
  }
}

export class SymbolType extends Type {
  match (input: any): boolean {
    return typeof input === 'symbol';
  }

  toString () {
    return 'Symbol';
  }


  toJSON () {
    return {
      '@type': 'SymbolType'
    };
  }
}

export class SymbolLiteralType extends Type {
  value: Symbol;
  match (input: any): boolean {
    return input === this.value;
  }

  toString () {
    return `typeof ${this.value.toString()}`;
  }

  toJSON () {
    return {
      '@type': 'SymbolLiteralType',
      value: this.value
    };
  }
}

export class StringType extends Type {
  match (input: any): boolean {
    return typeof input === 'string';
  }

  toString () {
    return 'string';
  }

  toJSON () {
    return {
      '@type': 'StringType'
    };
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

  toJSON () {
    return {
      '@type': 'StringLiteralType',
      value: this.value
    };
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

  toJSON () {
    return {
      '@type': 'ArrayType',
      elementType: this.elementType
    };
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

  toJSON () {
    return {
      '@type': 'ObjectType',
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

  toJSON () {
    return {
      '@type': 'ObjectTypeProperty',
      value: this.value
    };
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

  toJSON () {
    return {
      '@type': 'ObjectTypeIndexer',
      id: this.id,
      key: this.key,
      value: this.value
    };
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

  toJSON () {
    return {
      '@type': 'ObjectTypeProperty',
      key: this.key,
      value: this.value,
      optional: this.optional
    };
  }
}

export class FunctionType extends Type {
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
    const {params, rest, returnType} = this;
    const args = [];
    for (let i = 0; i < params.length; i++) {
      args.push(params[i].toString());
    }
    if (rest) {
      args.push(rest.toString());
    }
    return `(${args.join(', ')}) => ${returnType.toString()}`;
  }

  toJSON () {
    return {
      '@type': 'FunctionType',
      params: this.params,
      rest: this.rest,
      returnType: this.returnType
    };
  }
}

export class ParameterizedFunctionType <T: FunctionType> extends Type {
  bodyCreator: FunctionBodyCreator<T>;

  get partial (): PartialType<T> {
    const {context, bodyCreator} = this;
    const target = new PartialType(context);
    const body = bodyCreator(target);
    target.type = context.function(...body);
    return target;
  }

  get typeParameters (): TypeParameter[] {
    return this.partial.typeParameters;
  }

  get params (): FunctionTypeParam[] {
    return this.partial.type.params;
  }

  get rest (): ? FunctionTypeRestParam {
    return this.partial.type.rest;
  }

  get returnType (): Type {
    return this.partial.type.returnType;
  }

  match (input: any): boolean {
    return this.partial.match(input);
  }

  toString (): string {
    const {partial} = this;
    const {type, typeParameters} = partial;
    if (typeParameters.length === 0) {
      return type.toString();
    }
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
    return `<${items.join(', ')}> ${type.toString()}`;
  }

  toJSON () {
    const {partial} = this;
    return partial.toJSON();
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

  toJSON () {
    return {
      '@type': 'FunctionTypeParam',
      name: this.name,
      optional: this.optional,
      type: this.type
    };
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

  toJSON () {
    return {
      '@type': 'FunctionTypeRestParam',
      name: this.name,
      type: this.type
    };
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

  toJSON () {
    return {
      '@type': 'FunctionTypeReturn',
      type: this.type
    };
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

  toJSON () {
    return {
      '@type': 'GenericType',
      name: this.name,
      typeInstances: this.typeInstances
    };
  }
}

export class ExistentialType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return '*';
  }

  toJSON () {
    return {
      '@type': 'ExistentialType'
    };
  }
}

export class AnyType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'any';
  }

  toJSON () {
    return {
      '@type': 'AnyType'
    };
  }
}

export class MixedType extends Type {
  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'mixed';
  }

  toJSON () {
    return {
      '@type': 'MixedType'
    };
  }
}


export class EmptyType extends Type {
  match (input: any): boolean {
    return false; // empty types match nothing.
  }

  toString (): string {
    return 'empty';
  }

  toJSON () {
    return {
      '@type': 'EmptyType'
    };
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

  toJSON () {
    return {
      '@type': 'NullableType',
      type: this.type
    };
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

  toJSON () {
    return {
      '@type': 'TupleType',
      types: this.types
    };
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

  toJSON () {
    return {
      '@type': 'UnionType',
      types: this.types
    };
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

  toJSON () {
    return {
      '@type': 'IntersectionType',
      types: this.types
    };
  }
}

export class VoidType extends Type {
  match (input: any): boolean {
    return input === undefined;
  }

  toString (): string {
    return 'void';
  }

  toJSON () {
    return {
      '@type': 'VoidType'
    };
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


function makeErrorMessage (expected: Type, input: any): string {
  return `Expected ${expected.toString()}, got ${inspect(input)}`;
}
