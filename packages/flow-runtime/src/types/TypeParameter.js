/* @flow */

import Type from './Type';
import type Validation, {IdentifierPath} from '../Validation';

export type TypeParameterStatus = 'open' | 'closed';

import {TypeParameterStatusSymbol} from '../symbols';

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
  [TypeParameterStatusSymbol]: TypeParameterStatus = 'closed';

  /**
   * Determines whether the type parameter is "open" or not.
   * An open type parameter will make a union of all types it receives,
   * a closed type parameter will adopt the first type it sees and use that
   * for all subsequent checks.
   */
  get isOpen (): boolean {
    return (this: $FlowIssue<252>)[TypeParameterStatusSymbol] === 'open';
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {recorded, bound, context, isOpen} = this;
    if (bound instanceof TypeParameter && bound.isOpen) {
      // We're bound with a type parameter which is open.
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      return bound.collectErrors(validation, path, input);
    }
    if (recorded) {
      // we've already recorded a value for this type parameter
      if (isOpen) {
        if (bound && bound.collectErrors(validation, path, input)) {
          return true;
        }
        else if (recorded.accepts(input)) {
          // our existing type already permits this value, there's nothing to do.
          return false;
        }
        else {
          // we need to make a union
          this.recorded = context.union(recorded, context.typeOf(input));
          return false;
        }
      }
      else {
        // when type parameters are closed we check against the recorded value.
        return recorded.collectErrors(validation, path, input);
      }
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
    const {recorded, bound, context, isOpen} = this;
    if (bound instanceof TypeParameter && bound.isOpen) {
      // We're bound with a type parameter which is open.
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      return bound.accepts(input);
    }
    if (recorded) {
      if (isOpen) {
        if (bound && !bound.accepts(input)) {
          return false;
        }
        else if (recorded.accepts(input)) {
          return true;
        }
        else {
          this.recorded = context.union(recorded, context.typeOf(input));
          return true;
        }
      }
      else {
        return recorded.accepts(input);
      }
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

  acceptsType (input: Type<any>): boolean {
    const {recorded, bound} = this;
    if (input instanceof TypeParameter) {
      // We don't need to check for `recorded` or `bound` fields
      // because the input has already been resolved.
      return true;
    }
    else if (recorded) {
      return recorded.acceptsType(input);
    }
    else if (bound) {
      return bound.acceptsType(input);
    }
    else {
      // A generic type parameter accepts any input.
      return true;
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

/**
 * Open the given type parameters.
 */
export function openTypeParameters <T> (...typeParameters: TypeParameter<T>[]) {
  const {length} = typeParameters;
  for (let i = 0; i < length; i++) {
    (typeParameters[i]: $FlowIssue<252>)[TypeParameterStatusSymbol] = 'open';
  }
}

/**
 * Close the given type parameters.
 */
export function closeTypeParameters <T> (...typeParameters: TypeParameter<T>[]) {
  const {length} = typeParameters;
  for (let i = 0; i < length; i++) {
    (typeParameters[i]: $FlowIssue<252>)[TypeParameterStatusSymbol] = 'closed';
  }
}