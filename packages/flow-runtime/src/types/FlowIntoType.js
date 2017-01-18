/* @flow */

import Type from './Type';
import type Validation, {IdentifierPath} from '../Validation';

import TypeParameter from './TypeParameter';

/**
 * # FlowIntoType
 *
 * A virtual type which allows types it receives to "flow" upwards into a type parameter.
 * The type parameter will become of a union of any types seen by this instance.
 */
export default class FlowIntoType<T: any> extends Type {
  typeName: string = 'FlowIntoType';

  typeParameter: TypeParameter<T>;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {typeParameter, context} = this;

    const {recorded, bound} = typeParameter;

    if (bound instanceof FlowIntoType) {
      // We defer to the other type so that values from this
      // one can flow "upwards".
      return bound.collectErrors(validation, path, input);
    }
    if (recorded) {
      // we've already recorded a value for this type parameter
      if (bound && bound.collectErrors(validation, path, input)) {
        return true;
      }
      else if (recorded.accepts(input)) {
        // our existing type already permits this value, there's nothing to do.
        return false;
      }
      else {
        // we need to make a union
        typeParameter.recorded = context.union(recorded, context.typeOf(input));
        return false;
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

    typeParameter.recorded = context.typeOf(input);
    return false;
  }

  accepts (input: any): boolean {
    const {typeParameter, context} = this;

    const {recorded, bound} = typeParameter;

    if (bound instanceof FlowIntoType) {
      // We defer to the other type so that values from this
      // one can flow "upwards".
      return bound.accepts(input);
    }
    if (recorded) {
      // we've already recorded a value for this type parameter
      if (bound && !bound.accepts(input)) {
        return false;
      }
      else if (recorded.accepts(input)) {
        // our existing type already permits this value, there's nothing to do.
        return true;
      }
      else {
        // we need to make a union
        typeParameter.recorded = context.union(recorded, context.typeOf(input));
        return true;
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

    typeParameter.recorded = context.typeOf(input);
    return true;
  }

  acceptsType (input: Type<any>): boolean {
    const {typeParameter, context} = this;

    const {recorded, bound} = typeParameter;

    if (bound instanceof FlowIntoType) {
      // We defer to the other type so that values from this
      // one can flow "upwards".
      return bound.acceptsType(input);
    }
    if (recorded) {
      // we've already recorded a value for this type parameter
      if (bound && !bound.acceptsType(input)) {
        return false;
      }
      else if (recorded.acceptsType(input)) {
        // our existing type already permits this value, there's nothing to do.
        return true;
      }
      else {
        // we need to make a union
        typeParameter.recorded = context.union(recorded, input);
        return true;
      }
    }
    else if (bound) {
      if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
        return true;
      }
      else if (!bound.acceptsType(input)) {
        return false;
      }
    }

    typeParameter.recorded = input;
    return true;
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this.typeParameter.unwrap();
  }

  toString (withBinding?: boolean): string {
    return this.typeParameter.toString(withBinding);
  }

  toJSON () {
    return this.typeParameter.toJSON();
  }
}
