/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

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

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {typeParameter, context} = this;

    const {recorded, bound} = typeParameter;

    if (bound instanceof FlowIntoType) {
      // We defer to the other type so that values from this
      // one can flow "upwards".
      yield* bound.errors(validation, path, input);
      return;
    }
    if (recorded) {
      // we've already recorded a value for this type parameter
      if (bound) {
        let hasError = false;
        for (const error of bound.errors(validation, path, input)) {
          yield error;
          hasError = true;
        }
        if (hasError) {
          return;
        }
      }
      else if (recorded.accepts(input)) {
        // our existing type already permits this value, there's nothing to do.
        return;
      }
      else {
        // we need to make a union
        typeParameter.recorded = context.union(recorded, context.typeOf(input));
        return;
      }
    }
    else if (bound) {
      if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
        return;
      }
      else {
        let hasError = false;
        for (const error of bound.errors(validation, path, input)) {
          yield error;
          hasError = true;
        }
        if (hasError) {
          return;
        }
      }
    }

    typeParameter.recorded = context.typeOf(input);
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

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const {typeParameter, context} = this;

    const {recorded, bound} = typeParameter;
    if (bound instanceof FlowIntoType) {
      // We defer to the other type so that values from this
      // one can flow "upwards".
      return bound.compareWith(input);
    }
    if (recorded) {
      if (bound && compareTypes(bound, input) === -1) {
        return -1;
      }
      const result = compareTypes(recorded, input);
      if (result === 0) {
        // our existing type already permits this value, there's nothing to do.
        return 0;
      }
      // we need to make a union
      typeParameter.recorded = context.union(recorded, input);
      return 1;
    }
    else if (bound) {
      if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
        return 1;
      }
      const result = compareTypes(bound, input);
      if (result === -1) {
        return -1;
      }
    }

    typeParameter.recorded = input;
    return 0;
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
