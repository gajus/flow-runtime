/* @flow */

import Declaration from './Declaration';

import type {Type} from '../types';

import type Validation, {IdentifierPath} from '../Validation';

export default class ModuleExports<T> extends Declaration {
  typeName: string = 'ModuleExports';

  type: Type<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return this.type.collectErrors(validation, path, input);
  }

  unwrap () {
    return this.type.unwrap();
  }

  toString (): string {
    return `declare module.exports: ${this.type.toString()};`;
  }
}