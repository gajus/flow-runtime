/* @flow */

import TypeInferrer from './TypeInferrer';
import singletonTypes from './singletonTypes';
import invariant from './invariant';

import {
  Type,
  TypeParameter,
  TypeReference,
  ParameterizedNamedType,
  NamedType,
  TypeHandler,
  GenericType,
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
  GeneratorType,
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

import {
  ParentAccessor,
  NameRegistryAccessor,
  TypeHandlerRegistryAccessor,
  InferrerAccessor
} from './symbols';

import type {TypeCreator, FunctionBodyCreator, IApplicableType} from './types';

export type TypeHandlerConfig = {
  name: string;
  impl?: Function;
  typeName: string;
  match (input: any, ...typeInstances: Type[]): boolean;
  inferTypeParameters (input: any): Type[];
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

type NameRegistry = {
  [name: string]: Type | Class<TypeHandler>;
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
    if (item != null) {
      if (typeof item === 'function') {
        return new item(this);
      }
      else {
        return item;
      }
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

  declareTypeHandler ({name, impl, typeName, match, inferTypeParameters}: TypeHandlerConfig): TypeHandler {
    // @flowIssue 252
    const nameRegistry = this[NameRegistryAccessor];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = new TypeHandler(this);
    target.name = name;
    target.typeName = typeName;
    target.impl = impl;
    target.match = match;
    target.inferTypeParameters = inferTypeParameters;

    nameRegistry[name] = target;

    if (typeof impl === 'function') {
      // @flowIssue 252
      const handlerRegistry = this[TypeHandlerRegistryAccessor];
      (handlerRegistry: TypeHandlerRegistry);

      if (handlerRegistry.has(impl)) {
        throw new Error(`A type handler already exists for the given implementation.`);
      }
      handlerRegistry.set(impl, target);
    }
    return target;
  }

  getTypeHandler (impl: Function): ? TypeHandler {
    // @flowIssue 252
    const handlerRegistry = this[TypeHandlerRegistryAccessor];
    (handlerRegistry: TypeHandlerRegistry);

    return handlerRegistry.get(impl);
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

  generator (yieldType: Type, returnType?: Type, nextType?: Type): GeneratorType {
    const target = new GeneratorType(this);
    target.yieldType = yieldType;
    target.returnType = returnType || this.any();
    target.nextType = nextType || this.any();
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

  ref (subject: string | IApplicableType | Function, ...typeInstances: Type[]): Type {
    let target;
    if (typeof subject === 'string') {
      // try and eagerly resolve the reference
      target = this.get(subject);
      if (!target) {
        // defer dereferencing for now
        target = new TypeReference(this);
        target.name = subject;
      }
    }
    else if (typeof subject === 'function') {
      // @flowIssue 252
      const handlerRegistry = this[TypeHandlerRegistryAccessor];
      (handlerRegistry: TypeHandlerRegistry);

      // see if we have a dedicated TypeHandler for this.
      target = handlerRegistry.get(subject);

      if (!target) {
        // just use a generic type handler.
        target = new GenericType(this);
        target.impl = subject;
        target.name = subject.name;
      }

    }
    else if (subject instanceof Type) {
      target = subject;
    }
    else {
      throw new Error('Could not reference the given type.');
    }

    if (typeInstances.length) {
      invariant(typeof target.apply === 'function', `Cannot apply non-applicable type: ${target.typeName}.`);
      return target.apply(...typeInstances);
    }
    else {
      return target;
    }
  }

}

