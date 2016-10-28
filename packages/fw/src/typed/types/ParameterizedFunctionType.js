/* @flow */

import Type from './Type';
import type {Constructor} from './';

import PartialType from './PartialType';
import type FunctionType from './FunctionType';
import type FunctionTypeParam from './FunctionTypeParam';
import type FunctionTypeRestParam from './FunctionTypeRestParam';
import type FunctionTypeReturn from './FunctionTypeReturn';
import type TypeParameter from './TypeParameter';


export type FunctionBodyCreator <T: FunctionType> = (partial: PartialType<T>) => Array<FunctionTypeParam | FunctionTypeRestParam | FunctionTypeReturn>;


export default class ParameterizedFunctionType <T: FunctionType> extends Type {
  typeName: string = 'ParameterizedFunctionType';
  bodyCreator: FunctionBodyCreator<T>;

  get partial (): PartialType<T> {
    const {context, bodyCreator} = this;
    const target = new PartialType(context);
    const body = bodyCreator(target);
    target.type = context.function(...body);
    return target;
  }

  get typeParameters (): TypeParameter[] {
    return this.partial.typeParameters;
  }

  get params (): FunctionTypeParam[] {
    return this.partial.type.params;
  }

  get rest (): ? FunctionTypeRestParam {
    return this.partial.type.rest;
  }

  get returnType (): Type {
    return this.partial.type.returnType;
  }

  match (input: any): boolean {
    return this.partial.match(input);
  }


  matchType (input: Type): boolean {
    return this.partial.matchType(input);
  }

  matchParams (...args: any[]): boolean {
    return this.partial.type.matchParams(...args);
  }

  matchReturn (input: any): boolean {
    return this.partial.type.matchReturn(input);
  }

  assertParams <T> (...args: T[]): T[] {
    return this.partial.type.assertParams(...args);
  }

  assertReturn <T> (input: T): T {
    return this.partial.type.assertReturn(input);
  }

  makeErrorMessage (): string {
    return 'Invalid function.';
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this.partial.resolve();
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
