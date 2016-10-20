/* @flow */

import type TypeContext from './TypeContext';

import type {
  Type,
  ArrayType,
  ObjectType
} from './types';

export class TypeInferer {
  context: TypeContext;
  inferred: WeakMap<Object, Type> = new WeakMap();

  constructor (context: TypeContext) {
    this.context = context;
  }

  infer (input: any): Type {
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
    else if (typeof input === 'function') {
      return this.inferFunction(input);
    }
    else if (typeof input === 'object') {
      return this.inferObject(input);
    }
    else {
      return context.any();
    }
  }

  inferFunction (input: Function): Type {
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

  inferObject (input: Object): Type {
    if (this.inferred.has(input)) {
      return this.inferred.get(input);
    }
    const {context} = this;
    let type;
    if (Array.isArray(input)) {
      type = this.inferArray(input);
    }
    else if (!(input instanceof Object)) {
      type = this.inferDict(input);
    }
    else if (input.constructor !== Object) {
      const handler = context.getTypeHandler(input.constructor);
      if (handler) {
        type = handler.infer(input);
      }
      else {
        type = context.instanceOf(input.constructor);
      }
    }
    else {
      const body = [];
      for (const key in input) { // eslint-disable-line
        const value = input[key];
        body.push(context.property(key, this.infer(value)));
      }
      type = context.object(...body);
    }
    this.inferred.set(input, type);
    return type;
  }

  inferDict (input: Object): ObjectType {
    const numericIndexers = [];
    const stringIndexers = [];
    loop: for (const key in input) { // eslint-disable-line
      const value = input[key];
      const types = isNaN(+key) ? stringIndexers : numericIndexers;
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type.match(value)) {
          continue loop;
        }
      }
      types.push(this.infer(value));
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

  inferArray (input: any[]): ArrayType {
    const {context} = this;
    const types = [];
    const {length} = input;
    loop: for (let i = 0; i < length; i++) {
      const item = input[i];
      for (let j = 0; j < types.length; j++) {
        const type = types[j];
        if (type.match(item)) {
          continue loop;
        }
      }
      types.push(this.infer(item));
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