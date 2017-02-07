/* @flow */

import Declaration from './Declaration';
import PartialType from '../types/PartialType';
import TypeParameterApplication from '../types/TypeParameterApplication';
import type {Type} from '../types';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import type {ClassBodyCreator} from './';

export default class ParameterizedClassDeclaration<X, O: {}> extends Declaration {
  typeName: string = 'ParameterizedClassDeclaration';
  bodyCreator: ClassBodyCreator<X, O>;
  name: string;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any, ...typeInstances: Type<any>[]): Generator<ErrorTuple, void, void> {
    yield* getPartial(this, ...typeInstances).errors(validation, path, input);
  }

  accepts (input: any, ...typeInstances: Type<any>[]): boolean {
    return getPartial(this, ...typeInstances).accepts(input);
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return getPartial(this).compareWith(input);
  }

  unwrap (...typeInstances: Type<any>[]): Type<O> {
    return getPartial(this, ...typeInstances).unwrap();
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, O> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  toString (withDeclaration?: boolean) {
    return getPartial(this).toString(withDeclaration);
  }

  toJSON () {
    return getPartial(this).toJSON();
  }
}

function getPartial <X, O: {}> (parent: ParameterizedClassDeclaration<X, O>, ...typeInstances: Type<any>[]): PartialType<O> {

  const {context, bodyCreator} = parent;
  const partial = new PartialType(context);
  const body = bodyCreator(partial);
  if (Array.isArray(body)) {
    partial.type = context.class(parent.name, ...body);
  }
  else {
    partial.type = context.class(parent.name, body);
  }

  const {typeParameters} = partial;
  const limit = Math.min(typeInstances.length, typeParameters.length);
  for (let i = 0; i < limit; i++) {
    const typeParameter = typeParameters[i];
    const typeInstance = typeInstances[i];
    if (typeParameter.bound && typeParameter.bound !== typeInstance) {
      // if the type parameter is already bound we need to
      // create an intersection type with this one.
      typeParameter.bound = context.intersect(typeParameter.bound, typeInstance);
    }
    else {
      typeParameter.bound = typeInstance;
    }
  }

  return partial;
}

