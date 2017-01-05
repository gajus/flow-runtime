/* @flow */

import Type from './Type';
import type {TypeRevealer} from './';
import type Validation, {IdentifierPath} from '../Validation';

import TypeParameterApplication from './TypeParameterApplication';

export default class TypeBox<T: any> extends Type {
  typeName: string = 'TypeBox';

  reveal: TypeRevealer<T>;

  get name (): ? string {
    const {reveal} = this;
    const type = reveal();
    return (type: any).name;
  }

  get type (): Type<T> {
    const {reveal} = this;
    const type = reveal();
    if (!type) {
      throw new ReferenceError(`Cannot reveal boxed type.`);
    }
    return type;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return this.type.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.type.accepts(input);
  }

  acceptsType (input: Type<any>): boolean {
    return this.type.acceptsType(input);
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
