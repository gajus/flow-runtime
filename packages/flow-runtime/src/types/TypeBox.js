/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeRevealer} from './';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import TypeParameterApplication from './TypeParameterApplication';

const warnedInstances = new WeakSet();

export default class TypeBox<T: any> extends Type {
  typeName: string = 'TypeBox';

  reveal: TypeRevealer<T>;

  get name (): ? string {
    return (this.type: any).name;
  }

  get type (): Type<T> {
    const {reveal} = this;
    const type = reveal();
    if (!type) {
      if (!warnedInstances.has(this)) {
        this.context.emitWarningMessage('Failed to reveal boxed type.');
        warnedInstances.add(this);
      }
      return this.context.mixed();
    }
    else if (!(type instanceof Type)) {
      // we got a boxed reference to something like a class
      return this.context.ref(type);
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
    target.parent = this.type;
    target.typeInstances = typeInstances;
    return target;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this.type.unwrap();
  }

  toString (): string {
    return this.type.toString();
  }

  toJSON () {
    return this.type.toJSON();
  }
}
