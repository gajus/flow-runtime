/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';

import FunctionTypeParam from './FunctionTypeParam';
import FunctionTypeRestParam from './FunctionTypeRestParam';
import FunctionTypeReturn from './FunctionTypeReturn';
import EmptyType from './EmptyType';

import getErrorMessage from "../getErrorMessage";
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import {TypeSymbol} from '../symbols';

export default class FunctionType<P, R> extends Type {
  typeName: string = 'FunctionType';
  params: FunctionTypeParam<P>[] = [];
  rest: ? FunctionTypeRestParam<P>;
  returnType: FunctionTypeReturn<R>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    if (typeof input !== 'function') {
      yield [path, getErrorMessage('ERR_EXPECT_FUNCTION'), this];
      return;
    }
    const annotation = input[TypeSymbol];
    const {returnType, params} = this;
    if (annotation) {
      if (!annotation.params) {
        return;
      }
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const annotationParam = annotation.params[i];
        if (!annotationParam && !param.optional) {
          yield [
            path,
            getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()),
            this
          ];
        }
        else if (!param.acceptsType(annotationParam)) {
          yield [
            path,
            getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()),
            this
          ];
        }
      }
      if (!returnType.acceptsType(annotation.returnType)) {
        yield [
          path,
          getErrorMessage('ERR_EXPECT_RETURN', returnType.toString()),
          this
        ];
      }
    }
    else {
      const {context} = this;
      // We cannot safely check an unannotated function.
      // But we need to propagate `any` type feedback upwards.
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        param.acceptsType(context.any());
      }
      returnType.acceptsType(context.any());
    }
  }

  accepts (input: any): boolean {
    if (typeof input !== 'function') {
      return false;
    }
    const {returnType, params} = this;
    const annotation = input[TypeSymbol];
    if (annotation) {
      if (!annotation.params) {
        return true;
      }
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
    else {
      const {context} = this;
      // We cannot safely check an unannotated function.
      // But we need to propagate `any` type feedback upwards.
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        param.acceptsType(context.any());
      }
      returnType.acceptsType(context.any());
      return true;
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof FunctionType)) {
      return -1;
    }
    const returnType = this.returnType;
    const inputReturnType = input.returnType;
    let isGreater = false;
    const returnTypeResult = compareTypes(returnType, inputReturnType);
    if (returnTypeResult === -1) {
      return -1;
    }
    else if (returnTypeResult === 1) {
      isGreater = true;
    }

    const params = this.params;
    const inputParams = input.params;
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const inputParam = i >= inputParams.length ? input.rest : inputParams[i];
      if (inputParam == null) {
        return -1;
      }
      const result = compareTypes(param, inputParam);
      if (result === -1) {
        return -1;
      }
      else if (result === 1) {
        isGreater = true;
      }
    }
    return isGreater ? 1 : 0;
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

  invoke (...args: Type<P>[]): Type<R> | EmptyType {
    const {params, rest, context} = this;
    const paramsLength = params.length;
    const argsLength = args.length;
    for (let i = 0; i < paramsLength; i++) {
      const param = params[i];
      if (i < argsLength) {
        if (!param.acceptsType(args[i])) {
          return context.empty();
        }
      }
      else if (!param.accepts(undefined)) {
        return context.empty();
      }
    }

    if (argsLength > paramsLength && rest) {
      for (let i = paramsLength; i < argsLength; i++) {
        if (!rest.acceptsType(args[i])) {
          return context.empty();
        }
      }
    }

    return this.returnType.type;
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
