/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import FlowIntoType from './FlowIntoType';

import type Validation, {IdentifierPath} from '../Validation';

const FlowIntoSymbol = Symbol('FlowInto');

/**
 * # TypeParameter
 *
 * Type parameters allow polymorphic type safety.
 * The first time a type parameter is checked, it records the shape of its input,
 * this recorded shape is used to check all future inputs for this particular instance.
 */
export default class TypeParameter<T> extends Type {
  typeName: string = 'TypeParameter';
  id: string;
  bound: ? Type<T>;

  recorded: ? Type<T>;

  // @flowIssue 252
  [FlowIntoSymbol]: ? FlowIntoType = null;


  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {recorded, bound, context} = this;
    if (bound instanceof FlowIntoType) {
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      return bound.accepts(input);
    }
    else if (recorded) {
      // we've already recorded a value for this type parameter
      return recorded.collectErrors(validation, path, input);
    }
    else if (bound) {
      if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
        return false;
      }
      else if (bound.collectErrors(validation, path, input)) {
        return true;
      }
    }

    this.recorded = context.typeOf(input);
    return false;
  }

  accepts (input: any): boolean {
    const {recorded, bound, context} = this;
    if (bound instanceof FlowIntoType) {
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      return bound.accepts(input);
    }
    else if (recorded) {
      return recorded.accepts(input);
    }
    else if (bound) {
      if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
        return true;
      }
      else if (!bound.accepts(input)) {
        return false;
      }
    }

    this.recorded = context.typeOf(input);
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {recorded, bound} = this;
    if (input instanceof TypeParameter) {
      // We don't need to check for `recorded` or `bound` fields
      // because the input has already been unwrapped, so
      // if we got a type parameter it must be totally generic and
      // we treat it like Any.
      return 1;
    }
    else if (recorded) {
      return compareTypes(recorded, input);
    }
    else if (bound) {
      return compareTypes(bound, input);
    }
    else {
      // A generic type parameter accepts any input.
      return 1;
    }
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    const {recorded, bound} = this;
    if (recorded) {
      return recorded.unwrap();
    }
    else if (bound) {
      return bound.unwrap();
    }
    else {
      return this;
    }
  }

  toString (withBinding?: boolean): string {
    const {id, bound} = this;
    if (withBinding && bound) {
      return `${id}: ${bound.toString()}`;
    }
    return id;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      id: this.id,
      bound: this.bound,
      recorded: this.recorded
    };
  }
}

export function flowIntoTypeParameter <T> (typeParameter: TypeParameter<T>): FlowIntoType<T> {
  const existing: ? FlowIntoType<T> = (typeParameter: $FlowIssue<252>)[FlowIntoSymbol];
  if (existing) {
    return existing;
  }

  const target = new FlowIntoType(typeParameter.context);
  target.typeParameter = typeParameter;
  (typeParameter: $FlowIssue<252>)[FlowIntoSymbol] = target;
  return target;
}
