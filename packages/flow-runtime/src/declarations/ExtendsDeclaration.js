/* @flow */

import Declaration from './Declaration';

import type {Type} from '../types';

import type Validation, {IdentifierPath, ErrorTuple} from '../Validation';

export default class ExtendsDeclaration<T> extends Declaration {
  typeName: string = 'ExtendsDeclaration';

  type: Type<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.type.errors(validation, path, input);
  }

  unwrap () {
    return this.type.unwrap();
  }

  toString (withDeclaration?: boolean) {
    const {type} = this;
    if (withDeclaration) {
      return `extends ${type.toString()}`;
    }
    else {
      return type.toString();
    }
  }
}