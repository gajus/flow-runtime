/* @flow */

import Type from './Type';

import FunctionTypeParam from './FunctionTypeParam';
import FunctionTypeRestParam from './FunctionTypeRestParam';

import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

import {TypeSymbol} from '../symbols';

export default class FunctionType<P, R> extends Type {
  typeName: string = 'FunctionType';
  params: FunctionTypeParam<P>[] = [];
  rest: ? FunctionTypeRestParam<P>;
  returnType: Type<R>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    if (typeof input !== 'function') {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_FUNCTION'));
      return true;
    }
    const annotation = input[TypeSymbol];
    if (annotation) {
      const {returnType, params} = this;
      let hasErrors = false;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const annotationParam = annotation.params[i];
        if (!annotationParam && !param.optional) {
          validation.addError(path, this, getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()));
          hasErrors = true;
        }
        else if (!param.acceptsType(annotationParam)) {
          validation.addError(path, this, getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()));
          hasErrors = true;
        }
      }
      if (!returnType.acceptsType(annotation.returnType)) {
        validation.addError(path, this, getErrorMessage('ERR_EXPECT_RETURN', returnType.toString()));
        hasErrors = true;
      }
      return hasErrors;
    }
    else {
      // We cannot safely check an unannotated function.
      return false;
    }
  }

  accepts (input: any): boolean {
    if (typeof input !== 'function') {
      return false;
    }
    const {params} = this;
    const annotation = input[TypeSymbol];
    if (annotation) {
      const {returnType, params} = this;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const annotationParam = annotation.params[i];
        if (!annotationParam && !param.optional) {
          return false;
        }
        else if (!param.acceptsType(annotationParam)) {
          return false;
        }
      }
      if (!returnType.acceptsType(annotation.returnType)) {
        return false;
      }
      return true;
    }
    else if (params.length > input.length) {
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

  acceptsType (input: Type<any>): boolean {
    if (!(input instanceof FunctionType)) {
      return false;
    }
    const returnType = this.returnType;
    const inputReturnType = input.returnType;
    if (!returnType.acceptsType(inputReturnType)) {
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
      if (!param.acceptsType(inputParam)) {
        return false;
      }
    }
    return true;
  }

  acceptsParams (...args: any[]): boolean {
    const {params, rest} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        if (!param.accepts(args[i])) {
          return false;
        }
      }
      else if (!param.accepts(undefined)) {
        return false;
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        if (!rest.accepts(args[i])) {
          return false;
        }
      }
    }

    return true;
  }

  acceptsReturn (input: any): boolean {
    return this.returnType.accepts(input);
  }

  assertParams (...args: any[]): P[] {
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

  assertReturn <T> (input: any): T {
    this.returnType.assert(input);
    return input;
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
