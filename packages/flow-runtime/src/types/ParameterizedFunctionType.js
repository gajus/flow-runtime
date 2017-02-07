/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import PartialType from './PartialType';
import type FunctionTypeParam from './FunctionTypeParam';
import type FunctionTypeRestParam from './FunctionTypeRestParam';
import type FunctionTypeReturn from './FunctionTypeReturn';
import type TypeParameter from './TypeParameter';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export type FunctionBodyCreator <P, R> = (partial: PartialType<(...params: P[]) => R>) => Array<FunctionTypeParam<P> | FunctionTypeRestParam<P> | FunctionTypeReturn<R>>;


export default class ParameterizedFunctionType <X, P: any, R: any> extends Type {
  typeName: string = 'ParameterizedFunctionType';
  bodyCreator: FunctionBodyCreator<P, R>;

  get typeParameters (): TypeParameter<X>[] {
    return getPartial(this).typeParameters;
  }

  get params (): FunctionTypeParam<P>[] {
    return getPartial(this).type.params;
  }

  get rest (): ? FunctionTypeRestParam<P> {
    return getPartial(this).type.rest;
  }

  get returnType (): Type<R> {
    return getPartial(this).type.returnType;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any, ...typeInstances: Type<any>[]): Generator<ErrorTuple, void, void> {
    yield* getPartial(this, ...typeInstances).errors(validation, path, input);
  }

  accepts (input: any, ...typeInstances: Type<any>[]): boolean {
    return getPartial(this, ...typeInstances).accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(getPartial(this), input);
  }

  acceptsParams (...args: any[]): boolean {
    return getPartial(this).type.acceptsParams(...args);
  }

  acceptsReturn (input: any): boolean {
    return getPartial(this).type.acceptsReturn(input);
  }

  assertParams <T> (...args: T[]): T[] {
    return getPartial(this).type.assertParams(...args);
  }

  assertReturn <T> (input: T): T {
    return getPartial(this).type.assertReturn(input);
  }

  /**
   * Get the inner type or value.
   */
  unwrap (...typeInstances: Type<any>[]): Type<(...params: P[]) => R | any> {
    return getPartial(this, ...typeInstances).unwrap();
  }

  toString (): string {
    const partial = getPartial(this);
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
    const partial = getPartial(this);
    return partial.toJSON();
  }
}

function getPartial <X, P, R> (parent: ParameterizedFunctionType<X, P, R>, ...typeInstances: Type<any>[]): PartialType<(...params: P[]) => R> {

  const {context, bodyCreator} = parent;
  const partial = new PartialType(context);
  const body = bodyCreator(partial);
  partial.type = context.function(...body);

  const {typeParameters} = partial;
  const limit = Math.min(typeInstances.length, typeParameters.length);
  for (let i = 0; i < limit; i++) {
    const typeParameter = typeParameters[i];
    const typeInstance = typeInstances[i];
    if (typeParameter.bound && typeParameter.bound !== typeInstance) {
      // if the type parameter is already bound we need to
      // create an intersection type with this one.
      typeParameter.bound = context.intersect(typeParameter.bound, typeInstance);
    }
    else {
      typeParameter.bound = typeInstance;
    }
  }

  return partial;
}
