/* @flow */

import Declaration from './Declaration';
import PartialType from '../types/PartialType';
import TypeParameterApplication from '../types/TypeParameterApplication';
import type {Type, TypeParameter} from '../types';
import type {Property} from '../types/ObjectType';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

import type {ClassBodyCreator} from './';



export default class ParameterizedClassDeclaration<X, O: Object> extends Declaration {
  typeName: string = 'ParameterizedClassDeclaration';
  bodyCreator: ClassBodyCreator<X, O>;
  name: string;

  shapeID: Symbol = Symbol();

  get superClass (): ? Type<$Supertype<O>> {
    return getPartial(this).type.superClass;
  }

  get body (): ? Type<O> {
    return getPartial(this).type.body;
  }

  get properties(): Property<*, *>[] {
    return getPartial(this).type.properties;
  }

  get typeParameters (): TypeParameter<X>[] {
    return getPartial(this).typeParameters;
  }

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
    return getPartial(this, ...typeInstances).type;
  }

  isSuperClassOf (candidate: *) {
    return getPartial(this).type.isSuperClassOf(candidate);
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, O> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  toString (withDeclaration?: boolean) {
    if (!withDeclaration) {
      return this.name;
    }
    const partial = getPartial(this);
    const {type, typeParameters} = partial;
    if (typeParameters.length === 0) {
      return partial.toString(true);
    }
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
    const {superClass, body} = type;
    const superClassName = superClass && ((typeof superClass.name === 'string' && superClass.name) || superClass.toString());
    return `declare class ${this.name}<${items.join(', ')}>${superClassName ? ` extends ${superClassName}` : ''} ${body.toString()}`;
  }

  toJSON () {
    return getPartial(this).toJSON();
  }
}

function getPartial <X, O: Object> (parent: ParameterizedClassDeclaration<X, O>, ...typeInstances: Type<any>[]): PartialType<O> {

  const {context, bodyCreator} = parent;
  const partial = new PartialType(context);
  const body = bodyCreator(partial);
  if (Array.isArray(body)) {
    partial.type = context.class(parent.name, ...body);
  }
  else {
    partial.type = context.class(parent.name, body);
  }

  (partial.type: $FlowFixme).shapeID = parent.shapeID;

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

