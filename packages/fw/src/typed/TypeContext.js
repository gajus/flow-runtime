/* @flow */

import TypeInferrer from './TypeInferrer';
import primitiveTypes from './primitiveTypes';
import invariant from './invariant';

import {
  Type,
  TypeParameter,
  TypeReference,
  ParameterizedTypeAlias,
  TypeAlias,
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
  ParentSymbol,
  NameRegistrySymbol,
  ModuleRegistrySymbol,
  TypeHandlerRegistrySymbol,
  InferrerSymbol,
  TypeSymbol
} from './symbols';

import type {TypeCreator, FunctionBodyCreator, IApplicableType} from './types';

export type TypeHandlerConfig = {
  name: string;
  impl?: Function;
  typeName: string;
  accepts (input: any, ...typeInstances: Type[]): boolean;
  inferTypeParameters (input: any): Type[];
};

type ValidFunctionBody
 = TypeParameter
 | FunctionTypeParam
 | FunctionTypeRestParam
 | FunctionTypeReturn
 ;

type ObjectPropertyDict = {
  [name: string]: Type;
};

type ValidObjectBody
 = ObjectTypeCallProperty
 | ObjectTypeProperty
 | ObjectTypeIndexer
 ;

type NameRegistry = {
  [name: string]: Type | Class<TypeHandler>;
};

type ModuleRegistry = {
  [name: string]: TypeContext;
};

type TypeHandlerRegistry = Map<Function, Class<TypeHandler>>;

export default class TypeContext {

  // @flowIssue 252
  [ParentSymbol]: ? TypeContext;

  // @flowIssue 252
  [NameRegistrySymbol]: NameRegistry = {};

  // @flowIssue 252
  [TypeHandlerRegistrySymbol]: TypeHandlerRegistry = new Map();

  // @flowIssue 252
  [InferrerSymbol]: TypeInferrer = new TypeInferrer(this);

  // @flowIssue 252
  [ModuleRegistrySymbol]: ModuleRegistry = {};

  createContext <T: Type> (body: (context: TypeContext) => T): T {
    const context = new TypeContext();

    // @flowIssue 252
    context[ParentSymbol] = this;

    return body(context);
  }

  typeOf (input: any): Type {
    // @flowIssue 252
    const inferrer = this[InferrerSymbol];
    (inferrer: TypeInferrer);

    return inferrer.infer(input);
  }

  get (name: string): ? Type {
    // @flowIssue 252
    const item = this[NameRegistrySymbol][name];
    if (item != null) {
      if (typeof item === 'function') {
        return new item(this);
      }
      else {
        return item;
      }
    }
    // @flowIssue 252
    const parent = this[ParentSymbol];
    if (parent) {
      return parent.get(name);
    }
  }

  /**
   * Returns a decorator for a function or object with the given type.
   */
  annotate (type: Type): * {
    return function <T: Object | Function> (input: T): T {
      input[TypeSymbol] = type;
      return input;
    };
  }

  getAnnotation (input: Object | Function): ? Type {
    return input[TypeSymbol];
  }

  hasAnnotation (input: Object | Function): boolean {
    return input[TypeSymbol] ? true : false;
  }

  setAnnotation <T: Object | Function> (input: T, type: Type): T {
    input[TypeSymbol] = type;
    return input;
  }

  type <T: Type> (name: string, type: Type | TypeCreator<T>): TypeAlias | ParameterizedTypeAlias<T> {
    if (typeof type === 'function') {
      const target = new ParameterizedTypeAlias(this);
      target.name = name;
      target.typeCreator = type;
      return target;
    }
    else {
      const target = new TypeAlias(this);
      target.name = name;
      target.type = type;
      return target;
    }
  }

  declare <T: Type> (name: string, type: Type | TypeCreator<T>): TypeAlias | ParameterizedTypeAlias<T> {

    // @flowIssue 252
    const nameRegistry = this[NameRegistrySymbol];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = this.type(name, type);
    nameRegistry[name] = target;
    return target;
  }

  declareModule (name: string, body: (context: TypeContext) => Type[]) {

  }

  declareTypeHandler ({name, impl, typeName, accepts, inferTypeParameters}: TypeHandlerConfig): TypeHandler {
    // @flowIssue 252
    const nameRegistry = this[NameRegistrySymbol];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = new TypeHandler(this);
    target.name = name;
    target.typeName = typeName;
    target.impl = impl;
    target.accepts = accepts;
    target.inferTypeParameters = inferTypeParameters;

    nameRegistry[name] = target;

    if (typeof impl === 'function') {
      // @flowIssue 252
      const handlerRegistry = this[TypeHandlerRegistrySymbol];
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
    const handlerRegistry = this[TypeHandlerRegistrySymbol];
    (handlerRegistry: TypeHandlerRegistry);

    return handlerRegistry.get(impl);
  }

  null (): NullLiteralType {
    return primitiveTypes.null;
  }

  nullable (type: Type): NullableType {
    const target = new NullableType(this);
    target.type = type;
    return target;
  }

  existential (): ExistentialType {
    return primitiveTypes.existential;
  }

  empty (): EmptyType {
    return primitiveTypes.empty;
  }

  any (): AnyType {
    return primitiveTypes.any;
  }

  mixed (): MixedType {
    return primitiveTypes.mixed;
  }

  void (): VoidType {
    return primitiveTypes.void;
  }

  number (input?: number): NumberType | NumericLiteralType {
    if (input !== undefined) {
      const target = new NumericLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.number;
    }
  }

  boolean (input?: boolean): BooleanType | BooleanLiteralType {
    if (input !== undefined) {
      const target = new BooleanLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.boolean;
    }
  }

  string (input?: string): StringType | StringLiteralType {
    if (input !== undefined) {
      const target = new StringLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.string;
    }
  }

  symbol (input?: Symbol): SymbolType | SymbolLiteralType {
    if (input !== undefined) {
      const target = new SymbolLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.symbol;
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

  object (head: ? ObjectPropertyDict | ValidFunctionBody, ...tail: ValidObjectBody[]): ObjectType {
    const target = new ObjectType(this);
    if (head != null && typeof head === 'object' && !(head instanceof Type)) {
      for (const propertyName in head) { // eslint-disable-line
        target.properties.push(this.property(propertyName, head[propertyName]));
      }
    }
    else {
      let body;
      if (head) {
        body = [head, ...tail];
      }
      else {
        body = tail;
      }
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
      const handlerRegistry = this[TypeHandlerRegistrySymbol];
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

