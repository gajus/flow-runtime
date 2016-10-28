/* @flow */

import Type from './Type';
import type {Constructor} from './';

/**
 * # TypeParameter
 *
 * Type parameters allow polymorphic type safety.
 * The first time a type parameter is checked, it records the shape of its input,
 * this recorded shape is used to check all future inputs for this particular instance.
 */
export default class TypeParameter extends Type {
  typeName: string = 'TypeParameter';
  id: string;
  bound: ? Type;

  recorded: ? Type;

  accepts (input: any): boolean {

    const {recorded, bound, context} = this;

    if (recorded) {
      return recorded.accepts(input);
    }
    else if (bound && !bound.accepts(input)) {
      return false;
    }
    this.recorded = context.infer(input);

    return true;
  }

  acceptsType (input: Type): boolean {
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

  makeErrorMessage (): string {
    return `Invalid value for type parameter: ${this.id}`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    const {recorded, bound} = this;
    if (recorded) {
      return recorded.resolve();
    }
    else if (bound) {
      return bound.resolve();
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