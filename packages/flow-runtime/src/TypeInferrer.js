/* @flow */

import type TypeContext from './TypeContext';

import type {
  Type,
  ArrayType,
  ObjectType
} from './types';

type Inferred = Map<Object, Type>;

export class TypeInferer {
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

  infer (input: any): Type {
    const primitive = this.inferPrimitive(input);
    if (primitive) {
      return primitive;
    }
    const inferred = new Map();
    return this.inferComplex(input, inferred);
  }

  inferInternal (input: any, inferred: Inferred): Type {
    const primitive = this.inferPrimitive(input);
    if (primitive) {
      return primitive;
    }
    return this.inferComplex(input, inferred);
  }

  inferPrimitive (input: any): ? Type {
    const {context} = this;
    if (input === null) {
      return context.null();
    }
    else if (input === undefined) {
      return context.void();
    }
    else if (typeof input === 'number') {
      return context.number();
    }
    else if (typeof input === 'boolean') {
      return context.boolean();
    }
    else if (typeof input === 'string') {
      return context.string();
    }
    // @flowIssue 252
    else if (typeof input === 'symbol') {
      return context.symbol();
    }
    else {
      return undefined;
    }
  }

  inferComplex (input: any, inferred: Inferred) {
    const {context} = this;

    if (typeof input === 'function') {
      return this.inferFunction(input, inferred);
    }
    else if (typeof input === 'object') {
      return this.inferObject(input, inferred);
    }
    else {
      return context.any();
    }
  }

  inferFunction (input: Function, inferred: Inferred): Type {
    const {context} = this;
    const {length} = input;
    const body = new Array(length + 1);
    for (let i = 0; i < length; i++) {
      body[i] = context.param(
        String.fromCharCode(97 + i),
        context.existential()
      );
    }
    body[length] = context.return(context.existential());
    return context.fn(...body);
  }

  inferObject (input: Object, inferred: Inferred): Type {
    const existing = inferred.get(input);
    if (existing) {
      return existing;
    }
    const {context} = this;
    let type;
    if (Array.isArray(input)) {
      type = this.inferArray(input, inferred);
    }
    else if (!(input instanceof Object)) {
      type = this.inferDict(input, inferred);
    }
    else if (input.constructor !== Object) {
      const handler = context.getTypeHandler(input.constructor);
      if (handler) {
        const typeParameters = handler.inferTypeParameters(input);
        type = handler.apply(...typeParameters);
      }
      else {
        type = context.ref(input.constructor);
      }
    }
    else {
      const body = [];
      for (const key in input) { // eslint-disable-line
        const value = input[key];
        body.push(context.property(key, this.inferInternal(value, inferred)));
      }
      type = context.object(...body);
    }
    inferred.set(input, type);
    return type;
  }

  inferDict (input: Object, inferred: Inferred): ObjectType {
    const numericIndexers = [];
    const stringIndexers = [];
    loop: for (const key in input) { // eslint-disable-line
      const value = input[key];
      const types = isNaN(+key) ? stringIndexers : numericIndexers;
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type.accepts(value)) {
          continue loop;
        }
      }
      types.push(this.inferInternal(value, inferred));
    }

    const {context} = this;
    const body = [];
    if (numericIndexers.length === 1) {
      body.push(
        context.indexer(
          'index',
          context.number(),
          numericIndexers[0]
        )
      );
    }
    else if (numericIndexers.length > 1) {
      body.push(
        context.indexer(
          'index',
          context.number(),
          context.union(...numericIndexers)
        )
      );
    }

    if (stringIndexers.length === 1) {
      body.push(
        context.indexer(
          'key',
          context.string(),
          stringIndexers[0]
        )
      );
    }
    else if (stringIndexers.length > 1) {
      body.push(
        context.indexer(
          'key',
          context.string(),
          context.union(...stringIndexers)
        )
      );
    }

    return context.object(...body);
  }

  inferArray (input: any[], inferred: Inferred): ArrayType {
    const {context} = this;
    const types = [];
    const {length} = input;
    loop: for (let i = 0; i < length; i++) {
      const item = input[i];
      for (let j = 0; j < types.length; j++) {
        const type = types[j];
        if (type.accepts(item)) {
          continue loop;
        }
      }
      types.push(this.inferInternal(item, inferred));
    }
    if (types.length === 0) {
      return context.array(context.any());
    }
    else if (types.length === 1) {
      return context.array(types[0]);
    }
    else {
      return context.array(context.union(...types));
    }
  }

}

export default TypeInferer;