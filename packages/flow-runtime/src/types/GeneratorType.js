/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class GeneratorType<Y, R, N> extends Type {
  typeName: string = 'GeneratorType';
  yieldType: Type<Y>;
  returnType: Type<R>;
  nextType: Type<N>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const isValid = input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
    if (!isValid) {
      yield [path, getErrorMessage('ERR_EXPECT_GENERATOR'), this];
    }
  }

  accepts (input: any): boolean {
    return input
      && typeof input.next === 'function'
      && typeof input.return === 'function'
      && typeof input.throw === 'function'
      ;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof GeneratorType)) {
      const result = compareTypes(this.yieldType, input);
      if (result === -1) {
        return -1;
      }
      else {
        return 1;
      }
    }
    let isGreater = false;
    let result = compareTypes(this.yieldType, input.yieldType);
    if (result === -1) {
      return -1;
    }
    else if (result === 1) {
      isGreater = true;
    }

    result = compareTypes(this.returnType, input.returnType);
    if (result === -1) {
      return -1;
    }
    else if (result === 1) {
      isGreater = true;
    }

    result = compareTypes(this.nextType, input.nextType);
    if (result === -1) {
      return -1;
    }
    else if (result === 1) {
      isGreater = true;
    }

    return isGreater ? 1 : 0;
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