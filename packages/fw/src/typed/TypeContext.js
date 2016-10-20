/* @flow */

import TypeInferrer from './TypeInferrer';
import singletonTypes from './singletonTypes';

import {
  Type,
  TypeParameter,
  TypeReference,
  PartialType,
  ParameterizedNamedType,
  NamedType,
  TypeHandler,
  NullLiteralType,
  NumberType,
  NumericLiteralType,
  BooleanType,
  BooleanLiteralType,
  SymbolType,
  SymbolLiteralType,
  StringType,
  StringLiteralType,
  ArrayType,
  ObjectType,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  FunctionType,
  ParameterizedFunctionType,
  FunctionTypeParam,
  FunctionTypeRestParam,
  FunctionTypeReturn,
  GenericType,
  ExistentialType,
  AnyType,
  MixedType,
  EmptyType,
  NullableType,
  TupleType,
  UnionType,
  IntersectionType,
  VoidType
} from './types';

import type {TypeCreator, FunctionBodyCreator} from './types';

export type TypeAcquirer = (name: string) => ? Type;

export type TypeHandlerConfig = {
  match: (input: any, ...typeInstances: Type[]) => boolean;
  infer: (Handler: Class<TypeHandler>, input: any) => Type;
};

type ValidFunctionBody
 = TypeParameter
 | FunctionTypeParam
 | FunctionTypeRestParam
 | FunctionTypeReturn
 ;

type ValidObjectBody
 = ObjectTypeCallProperty
 | ObjectTypeProperty
 | ObjectTypeIndexer
 ;

const ParentAccessor = Symbol('Parent');
const NameRegistryAccessor = Symbol('NameRegistry');
const TypeHandlerRegistryAccessor = Symbol('TypeHandlerRegistry');
const InferrerAccessor = Symbol('Inferrer');

type NameRegistry = {
  [name: string]: Type;
};

type TypeHandlerRegistry = Map<Function, Class<TypeHandler>>;

export default class TypeContext {

  // @flowIssue 252
  [ParentAccessor]: ? TypeContext;

  // @flowIssue 252
  [NameRegistryAccessor]: NameRegistry = {};

  // @flowIssue 252
  [TypeHandlerRegistryAccessor]: TypeHandlerRegistry = new Map();

  // @flowIssue 252
  [InferrerAccessor]: TypeInferrer = new TypeInferrer(this);

  createContext <T: Type> (body: (context: TypeContext) => T): T {
    const context = new TypeContext();

    // @flowIssue 252
    context[ParentAccessor] = this;

    return body(context);
  }

  infer (input: any): Type {
    // @flowIssue 252
    const inferrer = this[InferrerAccessor];
    (inferrer: TypeInferrer);

    return inferrer.infer(input);
  }

  get (name: string): ? Type {
    // @flowIssue 252
    const item = this[NameRegistryAccessor][name];
    if (item) {
      return item;
    }
    // @flowIssue 252
    const parent = this[ParentAccessor];
    if (parent) {
      return parent.get(name);
    }
  }

  type <T: Type> (name: string, type: Type | TypeCreator<T>): NamedType | ParameterizedNamedType<T> {
    if (typeof type === 'function') {
      const target = new ParameterizedNamedType(this);
      target.name = name;
      target.typeCreator = type;
      return target;
    }
    else {
      const target = new NamedType(this);
      target.name = name;
      target.type = type;
      return target;
    }
  }

  declare <T: Type> (name: string, type: Type | TypeCreator<T>): NamedType | ParameterizedNamedType<T> {

    // @flowIssue 252
    const nameRegistry = this[NameRegistryAccessor];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = this.type(name, type);
    nameRegistry[name] = target;
    return target;
  }

  declareTypeHandler (name: string, impl: Function, {match, infer}: TypeHandlerConfig): Class<TypeHandler> {
    // @flowIssue 252
    const handlerRegistry = this[TypeHandlerRegistryAccessor];
    (handlerRegistry: TypeHandlerRegistry);

    if (handlerRegistry.has(impl)) {
      throw new Error(`A type handler already exists for the given implementation.`);
    }
    class Handler extends TypeHandler {
      name: string = name;
      impl: Function = impl;
      match (input: any): boolean {
        return match(input, ...this.typeInstances);
      }

      static infer (input: any): Type {
        return infer(Handler, input);
      }
    }
    Object.defineProperty(Handler, 'name', {value: `${name}TypeHandler`});

    handlerRegistry.set(impl, Handler);
    return Handler;
  }

  getTypeHandler (impl: Function): ? Class<TypeHandler> {
    // @flowIssue 252
    const handlerRegistry = this[TypeHandlerRegistryAccessor];
    (handlerRegistry: TypeHandlerRegistry);

    return handlerRegistry.get(impl);
  }

  instanceOf (input: Function | NamedType | PartialType<*>, ...typeInstances: Type[]): Type {
    if (input instanceof NamedType) {
      return input.apply(...typeInstances);
    }
    else if (input instanceof PartialType) {
      return input.apply(...typeInstances);
    }
    // @flowIssue 252
    const handlerRegistry = this[TypeHandlerRegistryAccessor];
    (handlerRegistry: TypeHandlerRegistry);

    const Handler = handlerRegistry.get(input);

    if (Handler) {
      const target = new Handler(this);
      target.typeInstances = typeInstances;
      return target;
    }

    const target = new GenericType(this);
    target.impl = input;
    target.name = input.name || `anonymous`;
    target.typeInstances = typeInstances;
    return target;
  }

  null (): NullLiteralType {
    return singletonTypes.null;
  }

  nullable (type: Type): NullableType {
    const target = new NullableType(this);
    target.type = type;
    return target;
  }

  existential (): ExistentialType {
    return singletonTypes.existential;
  }

  empty (): EmptyType {
    return singletonTypes.empty;
  }

  any (): AnyType {
    return singletonTypes.any;
  }

  mixed (): MixedType {
    return singletonTypes.mixed;
  }

  void (): VoidType {
    return singletonTypes.void;
  }

  number (input?: number): NumberType | NumericLiteralType {
    if (input !== undefined) {
      const target = new NumericLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return singletonTypes.number;
    }
  }

  boolean (input?: boolean): BooleanType | BooleanLiteralType {
    if (input !== undefined) {
      const target = new BooleanLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return singletonTypes.boolean;
    }
  }

  string (input?: string): StringType | StringLiteralType {
    if (input !== undefined) {
      const target = new StringLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return singletonTypes.string;
    }
  }

  symbol (input?: Symbol): SymbolType | SymbolLiteralType {
    if (input !== undefined) {
      const target = new SymbolLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return singletonTypes.symbol;
    }
  }

  typeParameter (id: string, bound?: Type): TypeParameter {
    const target = new TypeParameter(this);
    target.id = id;
    target.bound = bound;
    return target;
  }

  fn <T: FunctionType> (head: FunctionBodyCreator<T> | ValidFunctionBody, ...tail: Array<ValidFunctionBody>): ParameterizedFunctionType<T> | FunctionType {
    return this.function(head, ...tail);
  }

  function <T: FunctionType> (head: FunctionBodyCreator<T> | ValidFunctionBody, ...tail: Array<ValidFunctionBody>): ParameterizedFunctionType<T> | FunctionType {
    if (typeof head === 'function') {
      const target = new ParameterizedFunctionType(this);
      target.bodyCreator = head;
      return target;
    }
    const target = new FunctionType(this);
    tail.unshift(head);
    const {length} = tail;
    for (let i = 0; i < length; i++) {
      const item = tail[i];
      if (item instanceof FunctionTypeParam) {
        target.params.push(item);
      }
      else if (item instanceof FunctionTypeRestParam) {
        target.rest = item;
      }
      else if (item instanceof FunctionTypeReturn) {
        target.returnType = item;
      }
      else {
        throw new Error('FunctionType cannot contain the given type directly.');
      }
    }
    return target;
  }

  param (name: string, type: Type, optional: boolean = false): FunctionTypeParam {
    const target = new FunctionTypeParam(this);
    target.name = name;
    target.type = type;
    target.optional = optional;
    return target;
  }

  rest (name: string, type: Type): FunctionTypeRestParam {
    const target = new FunctionTypeRestParam(this);
    target.name = name;
    target.type = type;
    return target;
  }

  return (type: Type): FunctionTypeReturn {
    const target =  new FunctionTypeReturn(this);
    target.type = type;
    return target;
  }

  object (...body: ValidObjectBody[]): ObjectType {
    const target = new ObjectType(this);
    const {length} = body;
    for (let i = 0; i < length; i++) {
      const item = body[i];
      if (item instanceof ObjectTypeProperty) {
        target.properties.push(item);
      }
      else if (item instanceof ObjectTypeIndexer) {
        target.indexers.push(item);
      }
      else if (item instanceof ObjectTypeCallProperty) {
        target.callProperties.push(item);
      }
      else {
        throw new Error('ObjectType cannot contain the given type directly.');
      }
    }
    return target;
  }

  callProperty (value: Type): ObjectTypeCallProperty {
    const target = new ObjectTypeCallProperty(this);
    target.value = value;
    return target;
  }

  property (key: string, value: Type, optional: boolean = false): ObjectTypeProperty {
    const target = new ObjectTypeProperty(this);
    target.key = key;
    target.value = value;
    target.optional = optional;
    return target;
  }

  indexer (id: string, key: Type, value: Type): ObjectTypeIndexer {
    const target = new ObjectTypeIndexer(this);
    target.id = id;
    target.key = key;
    target.value = value;
    return target;
  }

  method (name: string, head: FunctionBodyCreator<*> | ValidFunctionBody, ...tail: Array<ValidFunctionBody>): ObjectTypeProperty {
    const target = new ObjectTypeProperty(this);
    target.key = name;
    target.value = this.function(head, ...tail);
    return target;
  }

  tuple (...types: Type[]): TupleType {
    const target = new TupleType(this);
    target.types = types;
    return target;
  }

  array (elementType?: Type): ArrayType {
    const target = new ArrayType(this);
    target.elementType = elementType || this.any();
    return target;
  }

  union (...types: Type[]): UnionType {
    const target = new UnionType(this);
    target.types = types;
    return target;
  }

  intersect (...types: Type[]): IntersectionType {
    const target = new IntersectionType(this);
    target.types = types;
    return target;
  }

  ref (name: string, acquirer?: TypeAcquirer): TypeReference {
    const target = new TypeReference(this);
    target.name = name;
    target.acquirer = acquirer || this;
    return target;
  }

}

