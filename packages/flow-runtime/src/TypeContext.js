/* @flow */

import TypeInferrer from './TypeInferrer';
import primitiveTypes from './primitiveTypes';
import invariant from './invariant';

import Validation from './Validation';

import makeReactPropTypes from './makeReactPropTypes';

import makeJSONError from './errorReporting/makeJSONError';
import makeTypeError from './errorReporting/makeTypeError';
import makeWarningMessage from './errorReporting/makeWarningMessage';

import makeUnion from './makeUnion';
import compareTypes from './compareTypes';
import {makePropertyDescriptor} from './classDecorators';

import {flowIntoTypeParameter} from './types/TypeParameter';

import annotateValue from './annotateValue';

import type {PropTypeDict} from './makeReactPropTypes';
import type {IdentifierPath, ErrorTuple} from './Validation';


import {
  Type,
  TypeParameter,
  TypeBox,
  TypeReference,
  TypeTDZ,
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
  FlowIntoType,
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
  ThisType,
  TupleType,
  IntersectionType,
  VoidType,
  RefinementType
} from './types';

import {
  Declaration,
  TypeDeclaration,
  VarDeclaration,
  ModuleDeclaration,
  ModuleExportsDeclaration,
  ClassDeclaration,
  ParameterizedClassDeclaration,
  ExtendsDeclaration
} from './declarations';

import {
  $DiffType,
  $FlowFixMeType,
  $KeysType,
  $ObjMapiType,
  $ObjMapType,
  $PropertyType as _$PropertyType,
  $ShapeType,
  $SubType,
  $SuperType,
  $TupleMapType,
  $ValuesType,
  ClassType
} from './flowTypes';

import {
  ParentSymbol,
  NameRegistrySymbol,
  ModuleRegistrySymbol,
  CurrentModuleSymbol,
  TypeConstructorRegistrySymbol,
  TypeParametersSymbol,
  InferrerSymbol,
  TypePredicateRegistrySymbol,
  TypeSymbol
} from './symbols';

import type {
  TypeConstraint,
  TypeCreator,
  TypeRevealer,
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
  compareWith?: (Type<any>) => -1 | 0 | 1;
  errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
  accepts (input: any, ...typeInstances: Type<any>[]): boolean;
  inferTypeParameters (input: any): Type<any>[];
};

export type TypePredicate = (input: any) => boolean;

type NameRegistry = {
  [name: string]: Type<any> | Class<TypeConstructor<any>>;
};

type TypePredicateRegistry = {
  [name: string]: TypePredicate;
};

type ModuleRegistry = {
  [name: string]: ModuleDeclaration;
};

type TypeConstructorRegistry = Map<Function, Class<TypeConstructor<any>>>;

export type MatchClause<P, R> = (...params: P[]) => R;
export type PatternMatcher<P, R> = (...params: P[]) => R;

export type CheckMode
  = 'assert'
  | 'warn'
  ;


/**
 * Keeps track of invalid references in order to prevent
 * multiple warnings.
 */
const warnedInvalidReferences: WeakSet<any> = new WeakSet();

export default class TypeContext {

  /**
   * Calls to `t.check(...)` will call either
   * `t.assert(...)` or `t.warn(...)` depending on this setting.
   */
  mode: CheckMode = 'assert';

  // @flowIssue 252
  [ParentSymbol]: ? TypeContext;

  // @flowIssue 252
  [NameRegistrySymbol]: NameRegistry = {};

  // @flowIssue 252
  [TypePredicateRegistrySymbol]: TypePredicateRegistry = {};

  // @flowIssue 252
  [TypeConstructorRegistrySymbol]: TypeConstructorRegistry = new Map();

  // @flowIssue 252
  [InferrerSymbol]: TypeInferrer = new TypeInferrer(this);

  // @flowIssue 252
  [ModuleRegistrySymbol]: ModuleRegistry = {};

  // @flowIssue 252
  [CurrentModuleSymbol]: ? ModuleDeclaration;

  get TypeParametersSymbol (): typeof TypeParametersSymbol {
    return TypeParametersSymbol;
  }


  makeJSONError <T> (validation: Validation<T>): ? Array<Object> {
    return makeJSONError(validation);
  }

  makeTypeError <T> (validation: Validation<T>): ? TypeError {
    return makeTypeError(validation);
  }

  createContext (): TypeContext {
    const context = new TypeContext();
    // @flowIssue 252
    context[ParentSymbol] = this;
    return context;
  }

  typeOf <T> (input: T): Type<T> {

    const annotation = this.getAnnotation(input);
    if (annotation) {
      if (typeof input === 'function' && (annotation instanceof ClassDeclaration || annotation instanceof ParameterizedClassDeclaration)) {
        return this.Class(annotation);
      }
      return annotation;
    }
    // @flowIssue 252
    const inferrer = this[InferrerSymbol];
    (inferrer: TypeInferrer);

    return inferrer.infer(input);
  }

  compareTypes (a: Type<any>, b: Type<any>): -1 | 0 | 1 {
    return compareTypes(a, b);
  }

  get (name: string, ...propertyNames: string[]): ? Type<any> {
    // @flowIssue 252
    const item = this[NameRegistrySymbol][name];
    if (item != null) {
      let current = typeof item === 'function'
                  ? new item(this)
                  : item
                  ;
      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];
        if (typeof current.getProperty !== 'function') {
          return;
        }
        current = current.getProperty(propertyName);
        if (!current) {
          return;
        }
        current = current.unwrap();
      }
      return current;
    }
    // @flowIssue 252
    const parent = this[ParentSymbol];
    if (parent) {
      const fromParent = parent.get(name, ...propertyNames);
      if (fromParent) {
        return fromParent;
      }
    }

    // if we got this far, see if we have a global type with this name.
    if (typeof global[name] === 'function') {
      const target = new GenericType(this);
      target.name = name;
      target.impl = global[name];
      // @flowIssue 252
      this[NameRegistrySymbol][name] = target;
      return target;
    }
  }

  /**
   * Get the predicate for a given type name.
   * e.g. `t.getPredicate('Array')`.
   */
  getPredicate (name: string): ? TypePredicate {
    const item: ? TypePredicate = (this: any)[TypePredicateRegistrySymbol][name];
    if (item) {
      return item;
    }
    const parent: ? TypeContext = (this: any)[ParentSymbol];
    if (parent) {
      return parent.getPredicate(name);
    }
  }

  /**
   * Set the predicate for a given type name.
   * This can be used to customise the behaviour of things like Array
   * detection or allowing Thenables in place of the global Promise.
   */
  setPredicate (name: string, predicate: TypePredicate) {
    (this: any)[TypePredicateRegistrySymbol][name] = predicate;
  }

  /**
   * Check the given value against the named predicate.
   * Returns false if no such predicate exists.
   * e.g. `t.checkPredicate('Array', [1, 2, 3])`
   */
  checkPredicate (name: string, input: any): boolean {
    const predicate = this.getPredicate(name);
    if (predicate) {
      return predicate(input);
    }
    else {
      return false;
    }
  }

  /**
   * Returns a decorator for a function or object with the given type.
   */
  decorate (type: (() => Type<any>) | Type<any>, shouldAssert?: boolean): * {
    if (shouldAssert == null) {
      shouldAssert = this.mode === 'assert';
    }
    return (input: Object | Function, propertyName?: string, descriptor?: Object): * => {
      if (descriptor && typeof propertyName === 'string') {
        return makePropertyDescriptor(type, input, propertyName, descriptor, Boolean(shouldAssert));
      }
      else {
        invariant(typeof type !== 'function', 'Cannot decorate an object or function as a method.');
        return this.annotate(input, type);
      }
    };
  }

  /**
   * Annotates an object or function with the given type.
   * If a type is specified as the sole argument, returns a
   * function which can decorate classes or functions with the given type.
   */
  annotate <T> (input: Type<T> | T, type?: Type<T>) {
    if (type === undefined) {
      return annotateValue(input);
    }
    else {
      return annotateValue(input, type);
    }
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

  declare <T: any, D: ModuleDeclaration | TypeDeclaration<T> | VarDeclaration<T> | ClassDeclaration<T>> (name: string | D, type?: Type<T> | TypeCreator<Type<T>>): D | TypeDeclaration<T> {

    if (name instanceof Declaration) {
      type = name;
      name = type.name;
    }
    else if (name instanceof TypeAlias) {
      type = name;
      name = type.name;
    }
    if (typeof type === 'function') {
      type = this.type(name, type);
    }
    if (type instanceof ModuleDeclaration) {
      const moduleRegistry: ModuleRegistry = (this: $FlowIssue<252>)[ModuleRegistrySymbol];
      moduleRegistry[name] = type;
      return type;
    }
    else {
      invariant(typeof name === 'string', 'Name must be a string');
      invariant(type instanceof Type, 'Type must be supplied to declaration');
      const nameRegistry: NameRegistry = (this: $FlowIssue<252>)[NameRegistrySymbol];

      if (type instanceof Declaration) {
        nameRegistry[name] = type;
        return type;
      }
      else if (type instanceof TypeAlias || type instanceof ParameterizedTypeAlias) {
        const target = new TypeDeclaration(this);
        target.name = name;
        target.typeAlias = type;
        nameRegistry[name] = target;
        return target;
      }
      else {
        const target = this.var(name, type);
        nameRegistry[name] = target;
        return target;
      }
    }
  }

  *declarations (): Generator<[string, Type<any> | TypeConstructor<any>], void, void> {
    const nameRegistry: NameRegistry = (this: $FlowIssue<252>)[NameRegistrySymbol];
    for (const key in nameRegistry) { // eslint-disable-line guard-for-in
      yield [key, nameRegistry[key]];
    }
  }

  *modules (): Generator<ModuleDeclaration, void, void> {
    const moduleRegistry: ModuleRegistry = (this: $FlowIssue<252>)[ModuleRegistrySymbol];
    for (const key in moduleRegistry) { // eslint-disable-line guard-for-in
      yield moduleRegistry[key];
    }
  }

  import (moduleName: string): ? ModuleDeclaration {
    const moduleRegistry: ModuleRegistry = (this: $FlowIssue<252>)[ModuleRegistrySymbol];
    if (moduleRegistry[moduleName]) {
      return moduleRegistry[moduleName];
    }
    const [head] = moduleName.split('/');
    const module = moduleRegistry[head];
    if (module) {
      return module.import(moduleName);
    }
    const parent = (this: $FlowIssue<252>)[ParentSymbol];
    if (parent) {
      return parent.import(moduleName);
    }
  }

  declareTypeConstructor ({name, impl, typeName, errors, accepts, inferTypeParameters, compareWith}: TypeConstructorConfig): TypeConstructor<any> {
    const nameRegistry: NameRegistry = (this: $FlowIssue<252>)[NameRegistrySymbol];

    if (nameRegistry[name]) {
      this.emitWarningMessage(`Redeclaring type: ${name}, this may be unintended.`);
    }

    const target = new TypeConstructor(this);
    target.name = name;
    target.typeName = typeName;
    target.impl = impl;
    target.errors = errors;
    target.accepts = accepts;
    target.inferTypeParameters = inferTypeParameters;
    if (typeof compareWith === 'function') {
      target.compareWith = compareWith;
    }

    nameRegistry[name] = target;

    if (typeof impl === 'function') {
      // @flowIssue 252
      const handlerRegistry = this[TypeConstructorRegistrySymbol];
      (handlerRegistry: TypeConstructorRegistry);

      if (handlerRegistry.has(impl)) {
        this.emitWarningMessage(`A type handler already exists for the given implementation of ${name}.`);
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

  literal <T: void | null | boolean | number | string | Symbol> (input: T): Type<T> {
    if (input === undefined) {
      return this.void();
    }
    else if (input === null) {
      return this.null();
    }
    else if (typeof input === 'boolean') {
      return this.boolean(input);
    }
    else if (typeof input === 'number') {
      return this.number(input);
    }
    else if (typeof input === 'string') {
      return this.string(input);
    }
    // @flowIssue 252
    else if (typeof input === 'symbol') {
      return this.symbol(input);
    }
    else {
      return this.typeOf(input);
    }
  }

  null (): NullLiteralType {
    return primitiveTypes.null;
  }

  nullable <T> (type: Type<T>): NullableType<? T> {
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

  this <T> (input?: T): ThisType<T> {
    const target = new ThisType(this);
    if (input !== undefined) {
      target.recorded = input;
    }
    return target;
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

  typeParameter <T> (id: string, bound?: Type<T>, defaultType?: Type<T>): TypeParameter<T> {
    const target = new TypeParameter(this);
    target.id = id;
    target.bound = bound;
    target.default = defaultType;
    return target;
  }

  flowInto <T> (typeParameter: TypeParameter<T>): FlowIntoType<T> {
    return flowIntoTypeParameter(typeParameter);
  }

  /**
   * Bind the type parameters for the parent class of the given instance.
   */
  bindTypeParameters <T: {}> (subject: T, ...typeInstances: Type<any>[]): T {
    const instancePrototype = Object.getPrototypeOf(subject);
    // @flowIssue
    const parentPrototype = instancePrototype && Object.getPrototypeOf(instancePrototype);
    // @flowIssue
    const parentClass = parentPrototype && parentPrototype.constructor;

    if (!parentClass) {
      this.emitWarningMessage('Could not bind type parameters for non-existent parent class.');
      return subject;
    }
    // @flowIssue 252
    const typeParametersPointer = parentClass[TypeParametersSymbol];

    if (typeParametersPointer) {
      const typeParameters = subject[typeParametersPointer];
      const keys = Object.keys(typeParameters);
      const length = Math.min(keys.length, typeInstances.length);
      for (let i = 0; i < length; i++) {
        const typeParam = typeParameters[keys[i]];
        typeParam.bound = typeInstances[i];
      }
    }
    return subject;
  }

  module (name: string, body: (context: TypeContext) => any): ModuleDeclaration {
    const target = new ModuleDeclaration(this);
    target.name = name;
    const innerContext = this.createContext();
    // @flowIssue 252
    innerContext[ParentSymbol] = this;
    // @flowIssue 252
    innerContext[CurrentModuleSymbol] = target;

    target.innerContext = innerContext;
    body(innerContext);
    return target;
  }

  moduleExports <T> (type: Type<T>): ModuleExportsDeclaration<T> {
    const currentModule: ModuleDeclaration = (this: $FlowIssue<252>)[CurrentModuleSymbol];
    if (!currentModule) {
      throw new Error('Cannot declare module.exports outside of a module.');
    }
    const target = new ModuleExportsDeclaration(this);
    target.type = type;
    currentModule.moduleExports = target;
    return target;
  }

  var <T> (name: string, type: Type<T>): VarDeclaration<T> {
    const target = new VarDeclaration(this);
    target.name = name;
    target.type = type;
    return target;
  }

  class <X, O: {}> (name: string, head?: ClassBodyCreator<X, O> | ValidClassBody<X, O>, ...tail: Array<ValidClassBody<X, O>>): ClassDeclaration<O> {
    if (typeof head === 'function') {
      const target = new ParameterizedClassDeclaration(this);
      target.name = name;
      target.bodyCreator = head;
      return target;
    }
    const target = new ClassDeclaration(this);
    target.name = name;
    if (head != null) {
      tail.unshift(head);
    }
    const {length} = tail;
    const properties = [];
    let body;

    for (let i = 0; i < length; i++) {
      const item = tail[i];
      if (item instanceof ObjectTypeProperty || item instanceof ObjectTypeIndexer) {
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
          properties.push(this.property(propertyName, (item: any)[propertyName]));
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

  function <X, P, R> (head: ? FunctionBodyCreator<X, P, R> | ValidFunctionBody<X, P, R>, ...tail: Array<ValidFunctionBody<X, P, R>>): ParameterizedFunctionType<X, P, R> | FunctionType<P, R> {
    if (typeof head === 'function') {
      const target = new ParameterizedFunctionType(this);
      target.bodyCreator = head;
      return target;
    }
    const target = new FunctionType(this);
    if (head != null) {
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
    }
    if (!target.returnType) {
      target.returnType = this.any();
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

  object <T: {}> (head: ? ValidObjectBody<T> | $ObjMap<T, <V>(v: V) => Type<V>>, ...tail: ValidObjectBody<T>[]): ObjectType<T> {
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

  exactObject <T: {}> (head: ? ValidObjectBody<T> | $ObjMap<T, <V>(v: V) => Type<V>>, ...tail: ValidObjectBody<T>[]): ObjectType<T> {
    const object = this.object(head, ...tail);
    object.exact = true;
    return object;
  }

  callProperty <T> (value: Type<T>): ObjectTypeCallProperty<T> {
    const target = new ObjectTypeCallProperty(this);
    target.value = value;
    return target;
  }

  property <K: string | number, V> (key: K, value: Type<V> | ObjectPropertyDict<{}>, optional: boolean = false): ObjectTypeProperty<K, V> {
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

  staticCallProperty <T: Function> (value: Type<T>): ObjectTypeCallProperty<T> {
    const prop = this.callProperty(value);
    (prop: $FlowIssue).static = true;
    return prop;
  }

  staticProperty <K: string | number, V> (key: K, value: Type<V> | ObjectPropertyDict<{}>, optional: boolean = false): ObjectTypeProperty<K, V> {
    const prop = this.property(key, value, optional);
    (prop: $FlowIssue).static = true;
    return prop;
  }

  staticMethod <K: string | number, X, P, R> (name: K, head: FunctionBodyCreator<X, P, R> | ValidFunctionBody<X, P, R>, ...tail: Array<ValidFunctionBody<X, P, R>>): ObjectTypeProperty<K, (...params: P[]) => R> {
    const prop = this.method(name, head, ...tail);
    (prop: $FlowIssue).static = true;
    return prop;
  }

  spread <T> (...types: Type<T>[]): ObjectType<T> {
    const target = new ObjectType(this);
    for (let i = 0; i < types.length; i++) {
      const type = types[i].unwrap();
      if (Array.isArray(type.callProperties)) {
        target.callProperties.push(...type.callProperties);
      }
      if (Array.isArray(type.indexers)) {
        target.indexers.push(...type.indexers);
      }
      if (Array.isArray(type.properties)) {
        for (let j = 0; j < type.properties.length; j++) {
          const prop = type.properties[j];
          invariant(prop instanceof ObjectTypeProperty);
          target.setProperty(prop.key, prop.value, prop.optional);
        }
      }
    }
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

  union <T> (...types: Type<T>[]): Type<T> {
    return makeUnion(this, types);
  }

  intersect <T: {}> (...types: Type<T>[]): IntersectionType<T> {
    const target = new IntersectionType(this);
    target.types = types;
    return target;
  }

  intersection <T: {}> (...types: Type<T>[]): IntersectionType<T> {
    return this.intersect(...types);
  }

  box <T> (reveal: TypeRevealer<T>): TypeBox<T> {
    const box = new TypeBox(this);
    box.reveal = reveal;
    return box;
  }

  tdz <T> (reveal: TypeRevealer<T>, name?: string): TypeTDZ<T> {
    const tdz = new TypeTDZ(this);
    tdz.reveal = reveal;
    tdz.name = name;
    return tdz;
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
      if (subject == null || typeof subject !== 'object') {
        this.emitWarningMessage(`Could not reference the given type, try t.typeOf(value) instead. (got ${String(subject)})`);
      }
      else if (!warnedInvalidReferences.has(subject)) {
        this.emitWarningMessage('Could not reference the given type, try t.typeOf(value) instead.');
        warnedInvalidReferences.add(subject);
      }
      return this.any();
    }

    if (typeInstances.length) {
      invariant(typeof target.apply === 'function', `Cannot apply non-applicable type: ${target.typeName}.`);
      return target.apply(...typeInstances);
    }
    else {
      return target;
    }
  }

  validate <T> (type: Type<T>, input: any, prefix: string = '', path?: string[]): Validation<T> {
    const validation = new Validation(this, input);
    if (path) {
      validation.path.push(...path);
    }
    else if (typeof type.name === 'string') {
      validation.path.push(type.name);
    }
    validation.prefix = prefix;
    validation.errors = Array.from(type.errors(validation, [], input));
    return validation;
  }

  check <T, V: T | any> (type: Type<T>, input: V, prefix: string = '', path?: string[]): V {
    if (this.mode === 'assert') {
      return this.assert(type, input, prefix, path);
    }
    else {
      return this.warn(type, input, prefix, path);
    }
  }

  assert <T, V: T | any> (type: Type<T>, input: V, prefix: string = '', path?: string[]): V {
    const validation = this.validate(type, input, prefix, path);
    const error = this.makeTypeError(validation);
    if (error) {
      throw error;
    }
    return input;
  }

  warn <T, V: T | any> (type: Type<T>, input: V, prefix: string = '', path?: string[]): V {
    const validation = this.validate(type, input, prefix, path);
    const message = makeWarningMessage(validation);
    if (typeof message === 'string') {
      this.emitWarningMessage(message);
    }
    return input;
  }

  /**
   * Emits a warning message, using `console.warn()` by default.
   */
  emitWarningMessage (message: string): void {
    console.warn('flow-runtime:', message);
  }

  propTypes <T: {}> (type: Type<T>): PropTypeDict<T> {
    return makeReactPropTypes((type.unwrap(): $FlowIgnore));
  }

  match <P, R> (...args: Array<P | MatchClause<P, R>>): R {
    const clauses: any = args.pop();
    if (!Array.isArray(clauses)) {
      throw new Error('Invalid pattern, last argument must be an array.');
    }
    (clauses: MatchClause<P, R>[]);
    const pattern = this.pattern(...clauses);
    return pattern(...args);
  }

  pattern <P, R> (...clauses: MatchClause<P, R>[]): PatternMatcher<P, R> {
    const {length} = clauses;
    const tests: Array<true | FunctionType<P, R> | ParameterizedFunctionType<any, P, R>> = new Array(length);
    for (let i = 0; i < length; i++) {
      const clause = clauses[i];
      const annotation = this.getAnnotation(clause);
      if (!annotation) {
        if (i !== length - 1) {
          throw new Error(`Invalid Pattern - found unannotated function in position ${i}, default clauses must be last.`);
        }
        tests[i] = true;
      }
      else {
        invariant(annotation instanceof FunctionType || annotation instanceof ParameterizedFunctionType, 'Pattern clauses must be annotated functions.');
        tests[i] = annotation;
      }
    }
    return (...args: P[]): R => {
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const clause = clauses[i];
        if (test === true) {
          return clause(...args);
        }
        else if (test.acceptsParams(...args)) {
          return clause(...args);
        }
      }
      const error = new TypeError('Value did not match any of the candidates.');
      error.name = 'RuntimeTypeError';
      throw error;
    };
  }

  wrapIterator <T> (type: Type<T>): (input: Iterable<T>) => Generator<T, void, void> {
    const t = this;
    return function* wrappedIterator (input: Iterable<T>): Generator<T, void, void> {
      for (const item of input) {
        yield t.check(type, item);
      }
    };
  }

  refinement <T> (type: Type<T>, ...constraints: TypeConstraint[]): RefinementType<T> {
    const target = new RefinementType(this);
    target.type = type;
    target.addConstraint(...constraints);
    return target;
  }

  $exact <T> (type: Type<T>): ObjectType<T> {
    const target = new ObjectType(this);
    type = type.unwrap();
    if (Array.isArray(type.callProperties)) {
      target.callProperties.push(...type.callProperties);
    }
    if (Array.isArray(type.indexers)) {
      target.indexers.push(...type.indexers);
    }
    if (Array.isArray(type.properties)) {
      target.properties.push(...type.properties);
    }
    target.exact = true;
    return target;
  }

  $diff <A: {}, B: {}> (aType: Type<A>, bType: Type<B>): $DiffType<A, B> {
    const target = new $DiffType(this);
    target.aType = aType;
    target.bType = bType;
    return target;
  }

  $flowFixMe (): $FlowFixMeType {
    return new $FlowFixMeType(this);
  }

  $keys <T: {}> (type: Type<T>): $KeysType<T> {
    const target = new $KeysType(this);
    target.type = type;
    return target;
  }

  $objMap <O: {}, K: $Keys<O>, M: (k: K) => any> (object: Type<O>, mapper: Type<M>): $ObjMapType<O, M> {
    const target = new $ObjMapType(this);
    target.object = object;
    target.mapper = mapper;
    return target;
  }

  $objMapi <O: {}, K: $Keys<O>, M: (k: K, v: any) => any> (object: Type<O>, mapper: Type<M>): $ObjMapiType<O, M> {
    const target = new $ObjMapiType(this);
    target.object = object;
    target.mapper = mapper;
    return target;
  }

  $propertyType <O: {}, P: string | number | Symbol> (object: Type<O>, property: P | Type<P>): _$PropertyType<O, P> {
    const target = new _$PropertyType(this);
    target.object = object;
    if (property instanceof Type) {
      const unwrapped = property.unwrap();
      target.property = (unwrapped: any).value;
    }
    else {
      target.property = property;
    }
    return target;
  }

  $shape <T: {}> (type: Type<T>): $ShapeType<T> {
    const target = new $ShapeType(this);
    target.type = type;
    return target;
  }

  $subtype <T: {}> (type: Type<T>): $SubType<T> {
    const target = new $SubType(this);
    target.type = type;
    return target;
  }

  $supertype <T: {}> (type: Type<T>): $SuperType<T> {
    const target = new $SuperType(this);
    target.type = type;
    return target;
  }

  $tupleMap <T: [], M: (v: *) => *> (tuple: Type<T>, mapper: Type<M>): $TupleMapType<T, M> {
    const target = new $TupleMapType(this);
    target.tuple = tuple;
    target.mapper = mapper;
    return target;
  }

  $values <T: {}> (type: Type<T>): $ValuesType<T> {
    const target = new $ValuesType(this);
    target.type = type;
    return target;
  }

  Class <T: {}> (instanceType: Type<T>): ClassType<T> {
    const target = new ClassType(this);
    target.instanceType = instanceType;
    return target;
  }
}
