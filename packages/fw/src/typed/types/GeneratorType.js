/* @flow */

import Type from './Type';

export default class GeneratorType extends Type {
  typeName: string = 'GeneratorType';
  yieldType: Type;
  returnType: Type;
  nextType: Type;

  accepts (input: any): boolean {
    return input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
  }

  acceptsType (input: Type): boolean {
    if (!(input instanceof GeneratorType)) {
      return this.yieldType.accepts(input);
    }
    return (
         this.yieldType.acceptsType(input.yieldType)
      && this.returnType.acceptsType(input.returnType)
      && this.nextType.acceptsType(input.nextType)
    );
  }

  acceptsYield (input: any): boolean {
    return this.yieldType.accepts(input);
  }

  acceptsReturn (input: any): boolean {
    return this.returnType.accepts(input);
  }

  acceptsNext (input: any): boolean {
    return this.nextType.accepts(input);
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