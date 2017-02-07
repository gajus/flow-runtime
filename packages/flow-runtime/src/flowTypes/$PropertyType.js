/* @flow */

import Type from '../types/Type';
import compareTypes from '../compareTypes';
import invariant from '../invariant';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// The type of the named object property

export default class $PropertyType<O: {}, P: string | number | Symbol> extends Type {
  typeName: string = '$PropertyType';

  object: Type<O>;

  property: P;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    yield* this.unwrap().errors(validation, path, input);
  }

  accepts (input: any): boolean {
    return this.unwrap().accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<*> {
    const {object, property} = this;
    const unwrapped = object.unwrap();
    invariant(typeof unwrapped.getProperty === 'function', 'Can only use $PropertyType on Objects.');
    return unwrapped.getProperty(property).unwrap();
  }

  toString (): string {
    return `$PropertyType<${this.object.toString()}, ${String(this.property)}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      object: this.object,
      property: this.property
    };
  }
}