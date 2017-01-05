/* @flow */

import Type from './Type';

import PartialType from './PartialType';
import type FunctionTypeParam from './FunctionTypeParam';
import type FunctionTypeRestParam from './FunctionTypeRestParam';
import type FunctionTypeReturn from './FunctionTypeReturn';
import type TypeParameter from './TypeParameter';

import type Validation, {IdentifierPath} from '../Validation';

export type FunctionBodyCreator <P, R> = (partial: PartialType<(...params: P[]) => R>) => Array<FunctionTypeParam<P> | FunctionTypeRestParam<P> | FunctionTypeReturn<R>>;


export default class ParameterizedFunctionType <X, P: any, R: any> extends Type {
  typeName: string = 'ParameterizedFunctionType';
  bodyCreator: FunctionBodyCreator<P, R>;

  get partial (): PartialType<(...params: P[]) => R> {
    const {context, bodyCreator} = this;
    const target = new PartialType(context);
    const body = bodyCreator(target);
    target.type = context.function(...body);
    return target;
  }

  get typeParameters (): TypeParameter<X>[] {
    return this.partial.typeParameters;
  }

  get params (): FunctionTypeParam<P>[] {
    return this.partial.type.params;
  }

  get rest (): ? FunctionTypeRestParam<P> {
    return this.partial.type.rest;
  }

  get returnType (): Type<R> {
    return this.partial.type.returnType;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return this.partial.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.partial.accepts(input);
  }


  acceptsType (input: Type<any>): boolean {
    return this.partial.acceptsType(input);
  }

  acceptsParams (...args: any[]): boolean {
    return this.partial.type.acceptsParams(...args);
  }

  acceptsReturn (input: any): boolean {
    return this.partial.type.acceptsReturn(input);
  }

  assertParams <T> (...args: T[]): T[] {
    return this.partial.type.assertParams(...args);
  }

  assertReturn <T> (input: T): T {
    return this.partial.type.assertReturn(input);
  }

  /**
   * Get the inner type or value.
   */
  unwrap (...typeInstances: Type<any>[]): Type<(...params: P[]) => R> {
    return this.partial.unwrap(...typeInstances);
  }

  toString (): string {
    const {partial} = this;
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
    const {partial} = this;
    return partial.toJSON();
  }
}
