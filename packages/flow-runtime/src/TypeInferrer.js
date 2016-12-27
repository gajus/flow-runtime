/* @flow */

import type TypeContext from './TypeContext';

import type {
  Type,
  ArrayType,
  ObjectType
} from './types';

type Inferred = Map<Object, Type<any>>;

export class TypeInferer {
  context: TypeContext;

  constructor (context: TypeContext) {
    this.context = context;
  }

  infer <T> (input: T): Type<T> {
    const primitive = this.inferPrimitive(input);
    if (primitive) {
      return primitive;
    }
    const inferred = new Map();
    return this.inferComplex(input, inferred);
  }

  inferInternal <T> (input: T, inferred: Inferred): Type<T> {
    const primitive = this.inferPrimitive(input);
    if (primitive) {
      return primitive;
    }
    return this.inferComplex(input, inferred);
  }

  inferPrimitive <T> (input: T): ? Type<T> {
    const {context} = this;
    if (input === null) {
      return (context.null(): any);
    }
    else if (input === undefined) {
      return (context.void(): any);
    }
    else if (typeof input === 'number') {
      return (context.number(): any);
    }
    else if (typeof input === 'boolean') {
      return (context.boolean(): any);
    }
    else if (typeof input === 'string') {
      return (context.string(): any);
    }
    // @flowIssue 252
    else if (typeof input === 'symbol') {
      return (context.symbol(): any);
    }
    else {
      return undefined;
    }
  }

  inferComplex <T> (input: T, inferred: Inferred): Type<T> {
    const {context} = this;

    if (typeof input === 'function') {
      return (this.inferFunction(input, inferred): any);
    }
    else if (input !== null && typeof input === 'object') {
      return (this.inferObject(input, inferred): any);
    }
    else {
      return (context.any(): any);
    }
  }

  inferFunction <T: Function> (input: T, inferred: Inferred): Type<T> {
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
    return (context.fn(...body): any);
  }

  inferObject <T: Object> (input: T, inferred: Inferred): Type<T> {
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
      const handler = context.getTypeConstructor(input.constructor);
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
    return (type: any);
  }

  inferDict <T: Object> (input: T, inferred: Inferred): ObjectType<T> {
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

  inferArray <T> (input: T[], inferred: Inferred): ArrayType<T> {
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
      return (context.array(context.any()): any);
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