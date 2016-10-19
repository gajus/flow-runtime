/* @flow */

import {
  Type,
  TypeParameter,
  TypeReference,
  NamedType,
  TypeHandler,
  NullLiteralType,
  NumberType,
  NumericLiteralType,
  BooleanType,
  BooleanLiteralType,
  SymbolType,
  StringType,
  StringLiteralType,
  ArrayType,
  ObjectType,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  FunctionType,
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

const primitives = {
  null: new NullLiteralType(),
  number: new NumberType(),
  boolean: new BooleanType(),
  string: new StringType(),
  any: new AnyType(),
  mixed: new MixedType(),
  void: new VoidType(),
};


export type TypeAcquirer = (name: string) => ? Type;

export type Matcher = (input: any, ...typeInstances: Type[]) => boolean;

type ValidFunctionBody
 = TypeParameter
 | FunctionTypeParam
 | FunctionTypeRestParam
 | FunctionTypeReturn
 | () => Array<ValidFunctionBody>
 ;

type ValidObjectBody
 = ObjectTypeCallProperty
 | ObjectTypeProperty
 | ObjectTypeIndexer
 ;

const ParentAccessor = Symbol('Parent');
const NameRegistryAccessor = Symbol('NameRegistry');
const TypeHandlerRegistryAccessor = Symbol('TypeHandlerRegistry');

type NameRegistry = {
  [name: string]: Type;
};

type TypeHandlerRegistry = Map<Function, Class<TypeHandler>>;

export class TypeContext {

  // @flowIssue 252
  [ParentAccessor]: ? TypeContext;

  // @flowIssue 252
  [NameRegistryAccessor]: NameRegistry = {};

  // @flowIssue 252
  [TypeHandlerRegistryAccessor]: TypeHandlerRegistry = new Map();


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

  type (name: string, type: Type | (type: NamedType) => Type): NamedType {
    const target = new NamedType();
    target.name = name;
    if (typeof type === 'function') {
      target.type = type(target);
    }
    else {
      target.type = type;
    }
    return target;
  }

  declare (name: string, type: Type | (type: NamedType) => Type): NamedType {

    // @flowIssue 252
    const nameRegistry = this[NameRegistryAccessor];

    if (nameRegistry[name]) {
      throw new Error(`Cannot redeclare type: ${name}`);
    }

    const target = this.type(name, type);
    nameRegistry[name] = target;
    return target;
  }

  declareTypeHandler (name: string, impl: Function, matcher: Matcher): Class<TypeHandler> {
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
        return matcher(input, ...this.typeInstances);
      }
    }
    Object.defineProperty(Handler, 'name', {value: `${name}TypeHandler`});

    handlerRegistry.set(impl, Handler);
    return Handler
  }

  scope <T: Type> (body: (context: TypeContext) => T): T {
    const context = new TypeContext();

    // @flowIssue 252
    context[ParentAccessor] = this;

    return body(context);
  }

  instanceOf (input: Function | NamedType, ...typeInstances: Type[]): Type {

    if (input instanceof NamedType) {
      return input.apply(...typeInstances);
    }

    // @flowIssue 252
    const handlerRegistry = this[TypeHandlerRegistryAccessor];
    (handlerRegistry: TypeHandlerRegistry);

    const Handler = handlerRegistry.get(input);

    if (Handler) {
      const target = new Handler();
      target.typeInstances = typeInstances;
      return target;
    }

    const target = new GenericType();
    target.impl = input;
    target.name = input.name || `anonymous`;
    target.typeInstances = typeInstances;
    return target;
  }

  null (): NullLiteralType {
    return primitives.null;
  }

  nullable (type: Type): NullableType {
    const target = new NullableType();
    target.type = type;
    return target;
  }

  any (): AnyType {
    return primitives.any;
  }

  mixed (): MixedType {
    return primitives.mixed;
  }

  void (): VoidType {
    return primitives.void;
  }

  number (input?: number): NumberType | NumericLiteralType {
    if (input !== undefined) {
      const target = new NumericLiteralType();
      target.value = input;
      return target;
    }
    else {
      return primitives.number;
    }
  }

  boolean (input?: boolean): BooleanType | BooleanLiteralType {
    if (input !== undefined) {
      const target = new BooleanLiteralType();
      target.value = input;
      return target;
    }
    else {
      return primitives.boolean;
    }
  }

  string (input?: string): StringType | StringLiteralType {
    if (input !== undefined) {
      const target = new StringLiteralType();
      target.value = input;
      return target;
    }
    else {
      return primitives.string;
    }
  }

  typeParameter (id: string, bound?: Type): TypeParameter {
    const target = new TypeParameter();
    target.id = id;
    target.bound = bound;
    return target;
  }

  fn (head: ValidFunctionBody, ...tail: Array<ValidFunctionBody>): FunctionType {
    return this.function(head, ...tail);
  }

  function (head: ValidFunctionBody, ...tail: Array<ValidFunctionBody>): FunctionType {
    const target = new FunctionType();
    let body;
    if (typeof head === 'function') {
      body = head();
    }
    else {
      body = [head, ...tail];
    }
    const {length} = body;
    for (let i = 0; i < length; i++) {
      const item = body[i];
      if (item instanceof TypeParameter) {
        target.typeParameters.push(item);
      }
      else if (item instanceof FunctionTypeParam) {
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
    const target = new FunctionTypeParam();
    target.name = name;
    target.type = type;
    target.optional = optional;
    return target;
  }

  rest (name: string, type: Type): FunctionTypeRestParam {
    const target = new FunctionTypeRestParam();
    target.name = name;
    target.type = type;
    return target;
  }

  return (type: Type): FunctionTypeReturn {
    const target =  new FunctionTypeReturn();
    target.type = type;
    return target;
  }

  object (...body: ValidObjectBody[]): ObjectType {
    const target = new ObjectType();
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
    const target = new ObjectTypeCallProperty();
    target.value = value;
    return target;
  }

  property (key: string, value: Type, optional: boolean = false): ObjectTypeProperty {
    const target = new ObjectTypeProperty();
    target.key = key;
    target.value = value;
    target.optional = optional;
    return target;
  }

  indexer (id: string, key: Type, value: Type): ObjectTypeIndexer {
    const target = new ObjectTypeIndexer();
    target.id = id;
    target.key = key;
    target.value = value;
    return target;
  }


  method (name: string, ...body: Array<ValidFunctionBody>): ObjectTypeProperty {
    const target = new ObjectTypeProperty();
    target.key = name;
    target.value = this.function(...body);
    return target;
  }

  tuple (...types: Type[]): TupleType {
    const target = new TupleType();
    target.types = types;
    return target;
  }

  union (...types: Type[]): UnionType {
    const target = new UnionType();
    target.types = types;
    return target;
  }

  intersect (...types: Type[]): IntersectionType {
    const target = new IntersectionType();
    target.types = types;
    return target;
  }

  ref (name: string, acquirer: TypeAcquirer | TypeContext = this): TypeReference {
    const target = new TypeReference();
    target.name = name;
    target.acquirer = acquirer;
    return target;
  }

}

export default TypeContext;
