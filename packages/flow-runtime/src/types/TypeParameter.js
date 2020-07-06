/* @flow */

import Type from './Type';
import compareTypes from '../compareTypes';
import FlowIntoType from "./FlowIntoType";
import TypeAlias from './TypeAlias';
import TypeParameterApplication from './TypeParameterApplication';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

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
  default: ? Type<T>;

  recorded: ? Type<T>;

  // @flowIssue 252
  [FlowIntoSymbol]: ? FlowIntoType = null;


  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const boundOrDefault = this.bound || this.default;
    const {recorded, context} = this;

    if (boundOrDefault instanceof FlowIntoType || boundOrDefault instanceof TypeAlias || boundOrDefault instanceof TypeParameterApplication) {
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      yield* boundOrDefault.errors(validation, path, input);
      return;
    }
    else if (recorded) {
      // we've already recorded a value for this type parameter
      yield* recorded.errors(validation, path, input);
      return;
    }
    else if (boundOrDefault) {
      if (boundOrDefault.typeName === 'AnyType' || boundOrDefault.typeName === 'ExistentialType') {
        return;
      }
      else {
        let hasErrors = false;
        for (const error of boundOrDefault.errors(validation, path, input)) {
          hasErrors = true;
          yield error;
        }
        if (hasErrors) {
          return;
        }
      }
    }

    this.recorded = context.typeOf(input);
  }

  accepts (input: any): boolean {
    const boundOrDefault = this.bound || this.default;
    const {recorded, context} = this;
    if (boundOrDefault instanceof FlowIntoType || boundOrDefault instanceof TypeAlias || boundOrDefault instanceof TypeParameterApplication) {
      // We defer to the other type parameter so that values from this
      // one can flow "upwards".
      return boundOrDefault.accepts(input);
    } else if (recorded) {
      return recorded.accepts(input);
    } else if (boundOrDefault) {
      if (boundOrDefault.typeName === "AnyType" || boundOrDefault.typeName === "ExistentialType") {
        return true;
      } else if (!boundOrDefault.accepts(input)) {
        return false;
      }
    }

    this.recorded = context.typeOf(input);
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    const boundOrDefault = this.bound || this.default;
    const {recorded} = this;
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
    else if (boundOrDefault) {
      return compareTypes(boundOrDefault, input);
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
    const boundOrDefault = this.bound || this.default;
    const {recorded} = this;
    if (recorded) {
      return recorded.unwrap();
    }
    else if (boundOrDefault) {
      return boundOrDefault.unwrap();
    }
    else {
      return this;
    }
  }

  toString (withBinding?: boolean): string {
    const {id, bound, default: defaultType} = this;
    if (withBinding) {
      if (defaultType) {
        return `${id} = ${defaultType.toString()}`;
      }
      else if (bound) {
        return `${id}: ${bound.toString()}`;
      }
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
