/* @flow */

import Type from './Type';

import FunctionTypeParam from './FunctionTypeParam';
import FunctionTypeRestParam from './FunctionTypeRestParam';

export default class FunctionType extends Type {
  typeName: string = 'FunctionType';
  params: FunctionTypeParam[] = [];
  rest: ? FunctionTypeRestParam;
  returnType: Type;

  match (input: any): boolean {
    if (typeof input !== 'function') {
      return false;
    }
    const {params} = this;
    if (params.length > input.length) {
      // function might not have enough parameters,
      // see how many are really required.
      let needed = 0;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (!param.optional) {
          needed++;
        }
      }
      if (needed > input.length) {
        return false;
      }
    }
    return true;
  }

  matchType (input: Type): boolean {
    if (!(input instanceof FunctionType)) {
      return false;
    }
    const returnType = this.returnType;
    const inputReturnType = input.returnType;
    if (!returnType.matchType(inputReturnType)) {
      return false;
    }
    const params = this.params;
    const inputParams = input.params;
    if (inputParams.length < params.length) {
      return false;
    }
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const inputParam = inputParams[i];
      if (!param.matchType(inputParam)) {
        return false;
      }
    }
    return true;
  }

  matchParams (...args: any[]): boolean {
    const {params, rest} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        if (!param.match(args[i])) {
          return false;
        }
      }
      else if (!param.match(undefined)) {
        return false;
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        if (!rest.match(args[i])) {
          return false;
        }
      }
    }

    return true;
  }

  matchReturn (input: any): boolean {
    return this.returnType.match(input);
  }

  assertParams <T> (...args: T[]): T[] {
    const {params, rest} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        param.assert(args[i]);
      }
      else {
        param.assert(undefined);
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        rest.assert(args[i]);
      }
    }

    return args;
  }

  assertReturn <T> (input: T): T {
    return this.returnType.assert(input);
  }

  makeErrorMessage (): string {
    return `Invalid function.`;
  }

  toString (): string {
    const {params, rest, returnType} = this;
    const args = [];
    for (let i = 0; i < params.length; i++) {
      args.push(params[i].toString());
    }
    if (rest) {
      args.push(rest.toString());
    }
    return `(${args.join(', ')}) => ${returnType.toString()}`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      params: this.params,
      rest: this.rest,
      returnType: this.returnType
    };
  }
}
