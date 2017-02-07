/* @flow */

import Declaration from './Declaration';

import type {Type} from '../types';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export default class ModuleExports<T> extends Declaration {
  typeName: string = 'ModuleExports';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.type.errors(validation, path, input);
  }

  unwrap () {
    return this.type.unwrap();
  }

  toString (): string {
    return `declare module.exports: ${this.type.toString()};`;
  }
}