/* @flow */

import Type from './Type';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';
import type {Constructor} from './';

import TypeParameterApplication from './TypeParameterApplication';

const warnedInstances = new WeakSet();

export default class TypeConstructor<T> extends Type {
  typeName: string = 'TypeConstructor';
  name: string;
  impl: ? Constructor<T>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
  }

  accepts <P> (input: any, ...typeInstances: Type<P>[]): boolean {
    const {context, name} = this;
    if (!warnedInstances.has(this)) {
      context.emitWarningMessage(`TypeConstructor ${name} does not implement accepts().`);
      warnedInstances.add(this);
    }
    return false;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {context, name} = this;
    if (!warnedInstances.has(this)) {
      context.emitWarningMessage(`TypeConstructor ${name} does not implement compareWith().`);
      warnedInstances.add(this);
    }
    return -1;
  }

  inferTypeParameters <P> (input: any): Type<P>[] {
    return [];
  }

  apply <P> (...typeInstances: Type<P>[]): TypeParameterApplication<P, T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): TypeConstructor<T> {
    return this;
  }

  toString (): string {
    return this.name;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name
    };
  }

}
