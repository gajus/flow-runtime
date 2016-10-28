/* @flow */

import Type from './Type';

export default class GeneratorType extends Type {
  typeName: string = 'GeneratorType';
  yieldType: Type;
  returnType: Type;
  nextType: Type;

  match (input: any): boolean {
    return input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
  }

  matchType (input: Type): boolean {
    if (!(input instanceof GeneratorType)) {
      return this.yieldType.match(input);
    }
    return (
         this.yieldType.matchType(input.yieldType)
      && this.returnType.matchType(input.returnType)
      && this.nextType.matchType(input.nextType)
    );
  }

  matchYield (input: any): boolean {
    return this.yieldType.match(input);
  }

  matchReturn (input: any): boolean {
    return this.returnType.match(input);
  }

  matchNext (input: any): boolean {
    return this.nextType.match(input);
  }

  assertYield <T> (input: T): T {
    return this.yieldType.assert(input);
  }

  assertReturn <T> (input: T): T {
    return this.returnType.assert(input);
  }

  assertNext <T> (input: T): T {
    return this.nextType.assert(input);
  }

  makeErrorMessage (): string {
    return `Invalid generator function.`;
  }

  toString (): string {
    const {yieldType, returnType, nextType} = this;
    return `Generator<${yieldType.toString()}, ${returnType.toString()}, ${nextType.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      yieldType: this.yieldType,
      returnType: this.returnType,
      nextType: this.nextType
    };
  }
}