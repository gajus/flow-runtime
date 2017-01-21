/* @flow */

import Type from './Type';
import SymbolLiteralType from './SymbolLiteralType';
import getErrorMessage from "../getErrorMessage";
import type Validation, {IdentifierPath} from '../Validation';

export default class SymbolType extends Type {
  typeName: string = 'SymbolType';

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    // @flowIssue 252
    if (typeof input === 'symbol') {
      return false;
    }
    else {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_SYMBOL'));
      return true;
    }
  }

  accepts (input: any): boolean {
    return typeof input === 'symbol';
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof SymbolLiteralType) {
      return 1;
    }
    else if (input instanceof SymbolType) {
      return 0;
    }
    else {
      return -1;
    }
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