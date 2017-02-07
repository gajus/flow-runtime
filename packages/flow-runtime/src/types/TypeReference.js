/* @flow */

import Type from './Type';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import TypeParameterApplication from './TypeParameterApplication';
import compareTypes from '../compareTypes';

const warnedMissing = {};

export default class TypeReference<T: any> extends Type {
  typeName: string = 'TypeReference';
  name: string;

  get type (): Type<T> {
    const {context, name} = this;
    const type = context.get(name);
    if (!type) {
      if (!warnedMissing[name]) {
        context.emitWarningMessage(`Cannot resolve type: ${name}`);
        warnedMissing[name] = true;
      }
      return (context.any(): any);
    }
    return type;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.type.errors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.type.accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.type, input);
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return (this.type.unwrap(): any);
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
