/* @flow */

import TypeInferrer from './TypeInferrer';
import primitiveTypes from './primitiveTypes';
import invariant from './invariant';

import Validation from './Validation';
import type {IdentifierPath} from './Validation';

import {
  Type,
  TypeParameter,
  TypeReference,
  ParameterizedTypeAlias,
  TypeAlias,
  TypeConstructor,
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
  ClassDeclaration,
  ExtendsDeclaration
} from './declarations';

import {
  ParentSymbol,
  NameRegistrySymbol,
  ModuleRegistrySymbol,
  TypeConstructorRegistrySymbol,
  InferrerSymbol,
  TypeSymbol
} from './symbols';

import type {
  TypeCreator,
  FunctionBodyCreator,
  ApplicableType,
  ValidFunctionBody,
  ObjectPropertyDict,
  ValidObjectBody
} from './types';

import type {
  ClassBodyCreator,
  ValidClassBody
} from './declarations';

export type TypeConstructorConfig = {
  name: string;
  impl?: Function;
  typeName: string;
  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any, instanceType: Type<any>): boolean;
  accepts (input: any, ...typeInstances: Type<any>[]): boolean;
  inferTypeParameters (input: any): Type<any>[];
};

type NameRegistry = {
  [name: string]: Type<any> | Class<TypeConstructor<any>>;
};

type ModuleRegistry = {
  [name: string]: TypeContext;
};

type TypeConstructorRegistry = Map<Function, Class<TypeConstructor<any>>>;

export default class TypeContext {

  // @flowIssue 252
  [ParentSymbol]: ? TypeContext;

  // @flowIssue 252
  [NameRegistrySymbol]: NameRegistry = {};

  // @flowIssue 252
  [TypeConstructorRegistrySymbol]: TypeConstructorRegistry = new Map();

  // @flowIssue 252
  [InferrerSymbol]: TypeInferrer = new TypeInferrer(this);

  // @flowIssue 252
  [ModuleRegistrySymbol]: ModuleRegistry = {};


  Type: typeof Type = Type;
  TypeParameter: typeof TypeParameter = TypeParameter;
  TypeReference: typeof TypeReference = TypeReference;
  ParameterizedTypeAlias: typeof ParameterizedTypeAlias = ParameterizedTypeAlias;
  TypeAlias: typeof TypeAlias = TypeAlias;
  TypeConstructor: typeof TypeConstructor = TypeConstructor;
  GenericType: typeof GenericType = GenericType;
  NullLiteralType: typeof NullLiteralType = NullLiteralType;
  NumberType: typeof NumberType = NumberType;
  NumericLiteralType: typeof NumericLiteralType = NumericLiteralType;
  BooleanType: typeof BooleanType = BooleanType;
  BooleanLiteralType: typeof BooleanLiteralType = BooleanLiteralType;
  SymbolType: typeof SymbolType = SymbolType;
  SymbolLiteralType: typeof SymbolLiteralType = SymbolLiteralType;
  StringType: typeof StringType = StringType;
  StringLiteralType: typeof StringLiteralType = StringLiteralType;
  ArrayType: typeof ArrayType = ArrayType;
  ObjectType: typeof ObjectType = ObjectType;
  ObjectTypeCallProperty: typeof ObjectTypeCallProperty = ObjectTypeCallProperty;
  ObjectTypeIndexer: typeof ObjectTypeIndexer = ObjectTypeIndexer;
  ObjectTypeProperty: typeof ObjectTypeProperty = ObjectTypeProperty;
  FunctionType: typeof FunctionType = FunctionType;
  ParameterizedFunctionType: typeof ParameterizedFunctionType = ParameterizedFunctionType;
  FunctionTypeParam: typeof FunctionTypeParam = FunctionTypeParam;
  FunctionTypeRestParam: typeof FunctionTypeRestParam = FunctionTypeRestParam;
  FunctionTypeReturn: typeof FunctionTypeReturn = FunctionTypeReturn;
  GeneratorType: typeof GeneratorType = GeneratorType;
  ExistentialType: typeof ExistentialType = ExistentialType;
  AnyType: typeof AnyType = AnyType;
  MixedType: typeof MixedType = MixedType;
  EmptyType: typeof EmptyType = EmptyType;
  NullableType: typeof NullableType = NullableType;
  TupleType: typeof TupleType = TupleType;
  UnionType: typeof UnionType = UnionType;
  IntersectionType: typeof IntersectionType = IntersectionType;
  VoidType: typeof VoidType = VoidType;

  createContext <T> (body: (context: TypeContext) => Type<T>): Type<T> {
    const context = new TypeContext();

    // @flowIssue 252
    context[ParentSymbol] = this;

    return body(context);
  }

  typeOf <T> (input: T): Type<T> {

    const annotation = this.getAnnotation(input);
    if (annotation) {
      return annotation;
    }
    // @flowIssue 252
    const inferrer = this[InferrerSymbol];
    (inferrer: TypeInferrer);

    return inferrer.infer(input);
  }

  get (name: string): ? Type<any> {
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
  decorate (type: Type<any>): * {
    return (input: Object | Function, propertyName?: string, descriptor?: Object): * => {
      if (descriptor && typeof propertyName === 'string') {
        if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
          return descriptor; // @todo decorate getters/setters
        }
        else {
          return {
            enumerable: true,
            writable: true,
            configurable: true,
            value: descriptor.value,
            initializer: descriptor.initializer
          };
        }
      }
      else {
        return this.annotate(input, type);
      }
    };
  }


  /**
   * Returns a decorator for a function or object with the given type.
   */
  annotate <T: Object | Function> (input: T, type: Type<any>): T {
    input[TypeSymbol] = type;
    return input;
  }

  getAnnotation <T> (input: T): ? Type<T> {
    if ((input !== null && typeof input === 'object') || typeof input === 'function') {
      // @flowIssue 252
      return input[TypeSymbol];
    }
  }

  hasAnnotation (input: any): boolean {
    if (input == null) {
      return false;
    }
    else {
      return input[TypeSymbol] ? true : false;
    }
  }

  setAnnotation <T: Object | Function> (input: T, type: Type<T>): T {
    input[TypeSymbol] = type;
    return input;
  }

  type <T> (name: string, type: Type<T> | TypeCreator<Type<T>>): TypeAlias<T> | ParameterizedTypeAlias<T> {
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

  declare <T> (name: string, type: Type<T> | TypeCreator<Type<T>>): TypeAlias<T> | ParameterizedTypeAlias<T> {

    // @flowIssue 252
    const nameRegistry = this[NameRegistrySymbol];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = this.type(name, type);
    nameRegistry[name] = target;
    return target;
  }

  declareModule (name: string, body: (context: TypeContext) => Type<any>[]) {

  }

  declareTypeConstructor ({name, impl, typeName, collectErrors, accepts, inferTypeParameters}: TypeConstructorConfig): TypeConstructor<any> {
    // @flowIssue 252
    const nameRegistry = this[NameRegistrySymbol];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = new TypeConstructor(this);
    target.name = name;
    target.typeName = typeName;
    target.impl = impl;
    target.collectErrors = collectErrors;
    target.accepts = accepts;
    target.inferTypeParameters = inferTypeParameters;

    nameRegistry[name] = target;

    if (typeof impl === 'function') {
      // @flowIssue 252
      const handlerRegistry = this[TypeConstructorRegistrySymbol];
      (handlerRegistry: TypeConstructorRegistry);

      if (handlerRegistry.has(impl)) {
        throw new Error(`A type handler already exists for the given implementation.`);
      }
      handlerRegistry.set(impl, target);
    }
    return target;
  }

  getTypeConstructor (impl: Function): ? TypeConstructor<any> {
    // @flowIssue 252
    const handlerRegistry = this[TypeConstructorRegistrySymbol];
    (handlerRegistry: TypeConstructorRegistry);

    return handlerRegistry.get(impl);
  }

  null (): NullLiteralType {
    return primitiveTypes.null;
  }

  nullable <T> (type: Type<T>): NullableType<T> {
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

  number <T: number> (input?: T): NumberType | NumericLiteralType<T> {
    if (input !== undefined) {
      const target = new NumericLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.number;
    }
  }

  boolean <T: boolean> (input?: T): BooleanType | BooleanLiteralType<T> {
    if (input !== undefined) {
      const target = new BooleanLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.boolean;
    }
  }

  string <T: string> (input?: T): StringType | StringLiteralType<T> {
    if (input !== undefined) {
      const target = new StringLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.string;
    }
  }

  symbol <T: Symbol> (input?: T): SymbolType | SymbolLiteralType<T> {
    if (input !== undefined) {
      const target = new SymbolLiteralType(this);
      target.value = input;
      return target;
    }
    else {
      return primitiveTypes.symbol;
    }
  }

  typeParameter <T> (id: string, bound?: Type<T>): TypeParameter<T> {
    const target = new TypeParameter(this);
    target.id = id;
    target.bound = bound;
    return target;
  }

  class <X, O: Object> (name: string, head: ClassBodyCreator<X, O> | ValidClassBody<X, O>, ...tail: Array<ValidClassBody<X, O>>): ClassDeclaration<O> {
    const target = new ClassDeclaration(this);
    if (typeof head === 'function') {
      return target;
    }
    target.name = name;
    tail.unshift(head);
    const {length} = tail;
    const properties = [];
    let body;

    for (let i = 0; i < length; i++) {
      const item = tail[i];
      if (item instanceof ObjectTypeProperty) {
        properties.push(item);
      }
      else if (item instanceof ObjectType) {
        invariant(!body, 'Class body must only be declared once.');
        body = item;
      }
      else if (item instanceof ExtendsDeclaration) {
        invariant(!target.superClass, 'Classes can only have one super class.');
        target.superClass = item;
      }
      else if (item != null && typeof item === 'object' && !(item instanceof Type)) {
        for (const propertyName in item) { // eslint-disable-line
          properties.push(this.property(propertyName, item[propertyName]));
        }
      }
      else {
        throw new Error('ClassDeclaration cannot contain the given type directly.');
      }
    }
    if (!body) {
      body = new ObjectType(this);
    }
    if (properties.length) {
      body.properties.push(...properties);
    }
    target.body = body;
    return target;
  }

  extends <T, P> (subject: string | ApplicableType<T> | Function, ...typeInstances: Type<P>[]): ExtendsDeclaration<T> {
    const target = new ExtendsDeclaration(this);
    target.type = this.ref(subject, ...typeInstances);
    return target;
  }

  fn <X, P, R> (head: FunctionBodyCreator<X, P, R> | ValidFunctionBody<X, P, R>, ...tail: Array<ValidFunctionBody<X, P, R>>): ParameterizedFunctionType<X, P, R> | FunctionType<P, R> {
    return this.function(head, ...tail);
  }

  function <X, P, R> (head: FunctionBodyCreator<X, P, R> | ValidFunctionBody<X, P, R>, ...tail: Array<ValidFunctionBody<X, P, R>>): ParameterizedFunctionType<X, P, R> | FunctionType<P, R> {
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

  param <T> (name: string, type: Type<T>, optional: boolean = false): FunctionTypeParam<T> {
    const target = new FunctionTypeParam(this);
    target.name = name;
    target.type = type;
    target.optional = optional;
    return target;
  }

  rest <T> (name: string, type: Type<T>): FunctionTypeRestParam<T> {
    const target = new FunctionTypeRestParam(this);
    target.name = name;
    target.type = type;
    return target;
  }

  return <T> (type: Type<T>): FunctionTypeReturn<T> {
    const target =  new FunctionTypeReturn(this);
    target.type = type;
    return target;
  }

  generator <Y, R, N> (yieldType: Type<Y>, returnType?: Type<R>, nextType?: Type<N>): GeneratorType<Y, R, N> {
    const target = new GeneratorType(this);
    target.yieldType = yieldType;
    target.returnType = returnType || this.any();
    target.nextType = nextType || this.any();
    return target;
  }

  object <T: Object> (head: ? ValidObjectBody<T> | Object, ...tail: ValidObjectBody<T>[]): ObjectType<T> {
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

  callProperty <T> (value: Type<T>): ObjectTypeCallProperty<T> {
    const target = new ObjectTypeCallProperty(this);
    target.value = value;
    return target;
  }

  property <K: string | number, V> (key: K, value: Type<V> | ObjectPropertyDict<Object>, optional: boolean = false): ObjectTypeProperty<K, V> {
    const target = new ObjectTypeProperty(this);
    target.key = key;
    if (value instanceof Type) {
      target.value = value;
    }
    else {
      target.value = this.object(value);
    }
    target.optional = optional;
    return target;
  }

  indexer <K, V> (id: string, key: Type<K>, value: Type<V>): ObjectTypeIndexer<K, V> {
    const target = new ObjectTypeIndexer(this);
    target.id = id;
    target.key = key;
    target.value = value;
    return target;
  }

  method <K: string | number, X, P, R> (name: K, head: FunctionBodyCreator<X, P, R> | ValidFunctionBody<X, P, R>, ...tail: Array<ValidFunctionBody<X, P, R>>): ObjectTypeProperty<K, (...params: P[]) => R> {
    const target = new ObjectTypeProperty(this);
    target.key = name;
    target.value = this.function(head, ...tail);
    return target;
  }

  tuple <T> (...types: Type<T>[]): TupleType<any> {
    const target = new TupleType(this);
    target.types = types;
    return target;
  }

  array <T> (elementType?: Type<T>): ArrayType<T> {
    const target = new ArrayType(this);
    target.elementType = elementType || this.any();
    return target;
  }

  union <T> (...types: Type<T>[]): UnionType<T> {
    const target = new UnionType(this);
    target.types = types;
    return target;
  }

  intersect <T> (...types: Type<T>[]): IntersectionType<T> {
    const target = new IntersectionType(this);
    target.types = types;
    return target;
  }

  ref <T, P> (subject: string | ApplicableType<T> | Function, ...typeInstances: Type<P>[]): Type<T | any> {
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
      const handlerRegistry = this[TypeConstructorRegistrySymbol];
      (handlerRegistry: TypeConstructorRegistry);

      // see if we have a dedicated TypeConstructor for this.
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

  validate <T> (type: Type<T>, input: any): Validation<T> {
    const validation = new Validation(this, input);
    if (typeof type.name === 'string') {
      validation.inputName = type.name;
    }
    type.collectErrors(validation, [], input);
    return validation;
  }
}

