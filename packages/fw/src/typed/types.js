/* @flow */

import makeError from './makeError';

import type TypeContext from './TypeContext';

export type TypeCreator <T: Type> = (partial: PartialType<T>) => T;
export type FunctionBodyCreator <T: FunctionType> = (partial: PartialType<T>) => Array<FunctionTypeParam | FunctionTypeRestParam | FunctionTypeReturn>;

export type TypeConstraint = (input: any) => boolean;

/**
 * # Type
 *
 * This is the base class for all types.
 */
export class Type {
  typeName: string = 'Type';
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

  match (input: any): boolean {
    throw new Error('Not implemented.');
  }

  assert <T> (input: T): T {
    if (!this.match(input)) {
      throw makeError(this, input);
    }
    return input;
  }

  makeErrorMessage (): string {
    return 'Invalid value for type.';
  }

  toString () {
    throw new Error('Not implemented.');
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

/**
 * # TypeParameter
 *
 * Type parameters allow polymorphic type safety.
 * The first time a type parameter is checked, it records the shape of its input,
 * this recorded shape is used to check all future inputs for this particular instance.
 */
export class TypeParameter extends Type {
  typeName: string = 'TypeParameter';
  id: string;
  bound: ? Type;

  recorded: ? Type;

  match (input: any): boolean {

    const {recorded, bound, context} = this;

    if (recorded) {
      return recorded.match(input);
    }
    else if (bound && !bound.match(input)) {
      return false;
    }
    this.recorded = context.infer(input);

    return true;
  }

  makeErrorMessage (): string {
    return `Invalid value for type parameter: ${this.id}`;
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
      typeName: this.typeName,
      id: this.id,
      bound: this.bound,
      recorded: this.recorded
    };
  }
}

/**
 * # TypeParameterApplication
 *
 */
export class TypeParameterApplication extends Type {
  typeName: string = 'TypeParameterApplication';
  parent: IApplicableType;
  typeInstances: Type[] = [];

  match (input: any): boolean {
    const {parent, typeInstances} = this;
    return parent.match(input, ...typeInstances);
  }

  makeErrorMessage (): string {
    return 'Invalid type parameter application.';
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
      typeName: this.typeName,
      typeInstances: this.typeInstances
    };
  }
}

export type IApplicableType = Type & {
  name: string;
  apply (...typeParameters: Type[]): TypeParameterApplication;
};

export class TypeReference extends Type {
  typeName: string = 'TypeReference';
  name: string;

  get type (): Type {
    const {context, name} = this;
    const type = context.get(name);
    if (!type) {
      throw new ReferenceError(`Cannot resolve type: ${name}`);
    }
    return type;
  }

  match (input: any): boolean {
    return this.type.match(input);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type: ${this.name}.`;
  }

  toString (): string {
    return this.name;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name
    };
  }
}


export class TypeHandler extends Type {
  typeName: string = 'TypeHandler';
  name: string;
  impl: ? Function;

  match (input: any, ...typeInstances: Type[]): boolean {
    throw new Error(`No matcher for ${this.name}.`);
  }

  inferTypeParameters (input: any): Type[] {
    throw new Error(`No inferrer for ${this.name}.`);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type handler: ${this.name}.`;
  }

  toString (): string {
    return this.name;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name
    };
  }

}

export class GenericType extends TypeHandler {
  typeName: string = 'GenericType';

  match (input: any, ...typeInstances: Type[]): boolean {
    return input instanceof this.impl;
  }

  inferTypeParameters (input: any): Type[] {
    return [];
  }

  makeErrorMessage (): string {
    return `Invalid value for generic type: ${this.name}.`;
  }

}


export class PartialType<T: Type> extends Type {
  typeName: string = 'PartialType';
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

  makeErrorMessage (): string {
    const {type} = this;
    if (type) {
      return type.makeErrorMessage();
    }
    else {
      return `Invalid value for partial type: ${this.name}.`;
    }
  }

  toString (expand?: boolean): string {
    const {type} = this;
    return type.toString(expand);
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeParameters: this.typeParameters,
      type: this.type
    };
  }
}


export class NamedType extends Type {
  typeName: string = 'NamedType';
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
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type: ${this.name}.`;
  }

  toString (withDeclaration?: boolean): string {
    const {name, type} = this;
    if (withDeclaration) {
      return `type ${name} = ${type.toString()};`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}



export class ParameterizedNamedType <T: Type> extends NamedType {
  typeName: string = 'ParameterizedNamedType';

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


  makeErrorMessage (): string {
    return `Invalid value for polymorphic type: ${this.toString()}.`;
  }

  toString (withDeclaration?: boolean): string {
    const {name, partial} = this;
    const {typeParameters} = partial;
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
    if (withDeclaration) {
      return `type ${name}<${items.join(', ')}> = ${partial.toString()};`;
    }
    else {
      return `${name}<${items.join(', ')}>`;
    }
  }

  toJSON () {
    const {partial} = this;
    return partial.toJSON();
  }
}


export class NullLiteralType extends Type {
  typeName: string = 'NullLiteralType';

  match (input: any): boolean {
    return input === null;
  }

  makeErrorMessage (): string {
    return 'Value is not null.';
  }

  toString (): string {
    return 'null';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class NumberType extends Type {
  typeName: string = 'NumberType';

  match (input: any): boolean {
    return typeof input === 'number';
  }

  makeErrorMessage (): string {
    return 'Value is not a number.';
  }

  toString (): string {
    return 'number';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class NumericLiteralType extends Type {
  typeName: string = 'NumericLiteralType';
  value: number;

  match (input: any): boolean {
    return input === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return `${this.value}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}

export class BooleanType extends Type {
  typeName: string = 'BooleanType';
  match (input: any): boolean {
    return typeof input === 'boolean';
  }

  makeErrorMessage (): string {
    return 'Value must be true or false.';
  }

  toString () {
    return 'boolean';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}


export class BooleanLiteralType extends Type {
  typeName: string = 'BooleanLiteralType';
  value: boolean;

  match (input: any): boolean {
    return input === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return this.value ? 'true' : 'false';
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}

export class SymbolType extends Type {
  typeName: string = 'SymbolType';

  match (input: any): boolean {
    return typeof input === 'symbol';
  }

  makeErrorMessage (): string {
    return 'Invalid value for type: Symbol.';
  }

  toString () {
    return 'Symbol';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class SymbolLiteralType extends Type {
  typeName: string = 'SymbolLiteralType';
  value: Symbol;

  match (input: any): boolean {
    return input === this.value;
  }


  makeErrorMessage (): string {
    return `Value must be exactly: ${this.value.toString()}.`;
  }

  toString () {
    return `typeof ${this.value.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}

export class StringType extends Type {
  typeName: string = 'StringType';

  match (input: any): boolean {
    return typeof input === 'string';
  }

  makeErrorMessage (): string {
    return 'Value must be a string.';
  }

  toString () {
    return 'string';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}


export class StringLiteralType extends Type {
  typeName: string = 'StringLiteralType';
  value: string;

  match (input: any): boolean {
    return input === this.value;
  }

  makeErrorMessage (): string {
    return `Value must be exactly: ${this.toString()}.`;
  }

  toString (): string {
    return JSON.stringify(this.value);
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}

export class ArrayType extends Type {
  typeName: string = 'ArrayType';
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

  makeErrorMessage (): string {
    return 'Invalid array.';
  }

  toString (): string {
    return `Array<${this.elementType.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      elementType: this.elementType
    };
  }
}

export class ObjectType extends Type {
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
  typeName: string = 'ObjectTypeCallProperty';
  value: Type;

  match (input: any): boolean {
    return this.value.match(input);
  }

  makeErrorMessage (): string {
    return 'Invalid object call property.';
  }

  toString (): string {
    return `${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      value: this.value
    };
  }
}

export class ObjectTypeIndexer extends Type {
  typeName: string = 'ObjectTypeIndexer';
  id: string;
  key: Type;
  value: Type;

  match (key: any, value: any): boolean {
    return this.key.match(key) && this.value.match(value);
  }

  makeErrorMessage (): string {
    return `Invalid object indexer: ${this.id}.`;
  }

  toString (): string {
    return `[${this.id}: ${this.key.toString()}]: ${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      id: this.id,
      key: this.key,
      value: this.value
    };
  }
}

export class ObjectTypeProperty extends Type {
  typeName: string = 'ObjectTypeProperty';
  key: string;
  value: Type;
  optional: boolean;

  match (input: Object): boolean {
    if (this.optional && input[this.key] === undefined) {
      return true;
    }
    return this.value.match(input[this.key]);
  }

  makeErrorMessage (): string {
    return `Invalid value for property: ${this.key}.`;
  }

  toString (): string {
    return `${this.key}${this.optional ? '?' : ''}: ${this.value.toString()};`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      key: this.key,
      value: this.value,
      optional: this.optional
    };
  }
}

export class FunctionType extends Type {
  typeName: string = 'FunctionType';
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

  matchParams (...args: any[]): boolean {
    const {params, rest} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        if (!param.match(args[i])) {
          return false;
        }
      }
      else if (!param.match(undefined)) {
        return false;
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        if (!rest.match(args[i])) {
          return false;
        }
      }
    }

    return true;
  }

  matchReturn (input: any): boolean {
    return this.returnType.match(input);
  }

  assertParams <T> (...args: T[]): T[] {
    const {params, rest} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        param.assert(args[i]);
      }
      else {
        param.assert(undefined);
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        rest.assert(args[i]);
      }
    }

    return args;
  }

  assertReturn <T> (input: T): T {
    return this.returnType.assert(input);
  }

  makeErrorMessage (): string {
    return `Invalid function.`;
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
      typeName: this.typeName,
      params: this.params,
      rest: this.rest,
      returnType: this.returnType
    };
  }
}

export class ParameterizedFunctionType <T: FunctionType> extends Type {
  typeName: string = 'ParameterizedFunctionType';
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

  matchParams (...args: any[]): boolean {
    return this.partial.type.matchParams(...args);
  }

  matchReturn (input: any): boolean {
    return this.partial.type.matchReturn(input);
  }

  assertParams <T> (...args: T[]): T[] {
    return this.partial.type.assertParams(...args);
  }

  assertReturn <T> (input: T): T {
    return this.partial.type.assertReturn(input);
  }

  makeErrorMessage (): string {
    return 'Invalid function.';
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
  typeName: string = 'FunctionTypeParam';
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

  makeErrorMessage (): string {
    return `Invalid value for ${this.optional ? 'optional ' : ''}argument: ${this.name}.`;
  }

  toString (): string {
    const {optional, type} = this;
    return `${this.name}${optional ? '?' : ''}: ${type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      optional: this.optional,
      type: this.type
    };
  }
}

export class FunctionTypeRestParam extends Type {
  typeName: string = 'FunctionTypeRestParam';
  name: string;
  type: Type;

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  makeErrorMessage (): string {
    return `Invalid value for rest argument: ${this.name}.`;
  }

  toString (): string {
    const {type} = this;
    return `...${this.name}: ${type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}

export class FunctionTypeReturn extends Type {
  typeName: string = 'FunctionTypeReturn';
  type: Type;

  match (input: any): boolean {
    const {type} = this;
    return type.match(input);
  }

  makeErrorMessage (): string {
    return 'Invalid function return type.';
  }

  toString (): string {
    const {type} = this;
    return type.toString();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}

export class GeneratorType extends Type {
  typeName: string = 'GeneratorType';
  yieldType: Type;
  returnType: Type;
  nextType: Type;

  match (input: any): boolean {
    return input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
  }

  matchYield (input: any): boolean {
    return this.yieldType.match(input);
  }

  matchReturn (input: any): boolean {
    return this.returnType.match(input);
  }

  matchNext (input: any): boolean {
    return this.nextType.match(input);
  }

  assertYield <T> (input: T): T {
    return this.yieldType.assert(input);
  }

  assertReturn <T> (input: T): T {
    return this.returnType.assert(input);
  }

  assertNext <T> (input: T): T {
    return this.nextType.assert(input);
  }

  makeErrorMessage (): string {
    return `Invalid generator function.`;
  }

  toString (): string {
    const {yieldType, returnType, nextType} = this;
    return `Generator<${yieldType.toString()}, ${returnType.toString()}, ${nextType.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      yieldType: this.yieldType,
      returnType: this.returnType,
      nextType: this.nextType
    };
  }
}

export class ExistentialType extends Type {
  typeName: string = 'ExistentialType';

  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return '*';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class AnyType extends Type {
  typeName: string = 'AnyType';

  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'any';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class MixedType extends Type {
  typeName: string = 'MixedType';

  match (input: any): boolean {
    return true;
  }

  toString (): string {
    return 'mixed';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}


export class EmptyType extends Type {
  typeName: string = 'EmptyType';

  match (input: any): boolean {
    return false; // empty types match nothing.
  }

  toString (): string {
    return 'empty';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}

export class NullableType extends Type {
  typeName: string = 'NullableType';
  type: Type;

  match (input: any): boolean {
    if (input == null) {
      return true;
    }
    else {
      return this.type.match(input);
    }
  }

  makeErrorMessage (): string {
    return this.type.makeErrorMessage();
  }

  toString (): string {
    return `? ${this.type.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      type: this.type
    };
  }
}

export class TupleType extends Type {
  typeName: string = 'TupleType';
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

  makeErrorMessage (): string {
    return 'Invalid tuple.';
  }

  toString (): string {
    return `[${this.types.join(', ')}]`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}

export class UnionType extends Type {
  typeName: string = 'UnionType';
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

  makeErrorMessage (): string {
    return 'Invalid union element.';
  }

  toString (): string {
    return this.types.join(' | ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}


export class IntersectionType extends Type {
  typeName: string = 'IntersectionType';
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

  makeErrorMessage (): string {
    return 'Invalid intersection element.';
  }

  toString (): string {
    return this.types.join(' & ');
  }

  toJSON () {
    return {
      typeName: this.typeName,
      types: this.types
    };
  }
}

export class VoidType extends Type {
  typeName: string = 'VoidType';

  match (input: any): boolean {
    return input === undefined;
  }

  makeErrorMessage (): string {
    return 'Value must be undefined.';
  }

  toString (): string {
    return 'void';
  }

  toJSON () {
    return {
      typeName: this.typeName
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
