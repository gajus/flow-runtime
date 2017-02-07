
import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeConstraint} from './';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';

import {collectConstraintErrors, constraintsAccept} from '../typeConstraints';

export default class PartialType<X, T> extends Type {
  typeName: string = 'PartialType';
  name: string;
  type: Type<T>;
  typeParameters: TypeParameter<X>[] = [];
  constraints: ? TypeConstraint[];

  typeParameter (id: string, bound?: Type<X>, defaultType?: Type<X>): TypeParameter<X> {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    target.default = defaultType;
    this.typeParameters.push(target);
    return target;
  }

  apply (...typeInstances: Type<X>[]): TypeParameterApplication<X, T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {constraints, type} = this;
    let hasErrors = false;
    for (const error of type.errors(validation, path, input)) {
      hasErrors = true;
      yield error;
    }
    if (!hasErrors && constraints) {
      yield* collectConstraintErrors(this, validation, path, input);
    }
  }

  accepts (input: any): boolean {
    const {constraints, type} = this;
    if (!type.accepts(input)) {
      return false;
    }
    else if (constraints && !constraintsAccept(this, input)) {
      return false;
    }
    else {
      return true;
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input === this) {
      return 0;
    }
    else {
      return compareTypes(this.type, input);
    }
  }

  toString (expand?: boolean): string {
    const {type} = this;
    return type.toString(expand);
  }

  /**
   * Get the inner type or value.
   */
  unwrap (): Type<T> {
    return this.type.unwrap();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeParameters: this.typeParameters,
      type: this.type
    };
  }
}