/* @flow */

import Type from './Type';
import SymbolLiteralType from './SymbolLiteralType';

export default class SymbolType extends Type {
  typeName: string = 'SymbolType';

  match (input: any): boolean {
    return typeof input === 'symbol';
  }

  matchType (input: Type): boolean {
    return input instanceof SymbolType || input instanceof SymbolLiteralType;
  }

  makeErrorMessage (): string {
    return 'Invalid value for type: Symbol.';
  }

  toString () {
    return 'Symbol';
  }

  toJSON () {
    return {
      typeName: this.typeName
    };
  }
}