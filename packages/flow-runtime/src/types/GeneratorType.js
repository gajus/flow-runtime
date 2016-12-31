/* @flow */

import Type from './Type';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class GeneratorType<Y, R, N> extends Type {
  typeName: string = 'GeneratorType';
  yieldType: Type<Y>;
  returnType: Type<R>;
  nextType: Type<N>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const isValid = input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
    if (isValid) {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_GENERATOR'));
      return true;
    }
  }

  accepts (input: any): boolean {
    return input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
  }

  acceptsType (input: Type<any>): boolean {
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

  assertYield (input: Y): Y {
    return this.yieldType.assert(input);
  }

  assertReturn (input: R): R {
    return this.returnType.assert(input);
  }

  assertNext (input: N): N {
    return this.nextType.assert(input);
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