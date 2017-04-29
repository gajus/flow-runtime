
import Type from './Type';
import compareTypes from '../compareTypes';
import type {TypeCreator} from './';
import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';
import TypeAlias from './TypeAlias';
import PartialType from './PartialType';
import type ObjectTypeProperty from './ObjectTypeProperty';

import {constraintsAccept} from '../typeConstraints';


export default class ParameterizedTypeAlias <T: Type> extends TypeAlias {
  typeName: string = 'ParameterizedTypeAlias';

  typeCreator: TypeCreator<T>;

  get properties () {
    return getPartial(this).type.properties;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any, ...typeInstances: Type<any>[]): Generator<ErrorTuple, void, void> {
    yield* getPartial(this, ...typeInstances).errors(validation, path, input);
  }

  accepts (input: any, ...typeInstances: Type<any>[]): boolean {
    const partial = getPartial(this, ...typeInstances);
    if (!partial.accepts(input)) {
      return false;
    }
    else if (!constraintsAccept(this, input)) {
      return false;
    }
    else {
      return true;
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input === this) {
      return 0; // should never need this because it's taken care of by compareTypes.
    }
    else if (this.hasConstraints) {
      // if we have constraints the types cannot be the same
      return -1;
    }
    else {
      return compareTypes(getPartial(this), input);
    }
  }

  hasProperty (name: string, ...typeInstances: Type<any>[]): boolean {
    const inner = this.unwrap(...typeInstances);
    if (inner && typeof inner.hasProperty === 'function') {
      return inner.hasProperty(name, ...typeInstances);
    }
    else {
      return false;
    }
  }

  getProperty (name: string, ...typeInstances: Type<any>[]): ? ObjectTypeProperty<any> {
    const inner = this.unwrap(...typeInstances);
    if (inner && typeof inner.getProperty === 'function') {
      return inner.getProperty(name, ...typeInstances);
    }
  }

  /**
   * Get the inner type or value.
   */
  unwrap (...typeInstances: Type<any>[]): Type<any> {
    return getPartial(this, ...typeInstances).unwrap();
  }

  toString (withDeclaration?: boolean): string {
    const partial = getPartial(this);
    const {typeParameters} = partial;
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }

    const {name} = this;
    const identifier = typeParameters.length > 0
                     ? `${name}<${items.join(', ')}>`
                     : name
                     ;

    if (withDeclaration) {
      return `type ${identifier} = ${partial.toString()};`;
    }
    else {
      return identifier;
    }
  }

  toJSON () {
    const partial = getPartial(this);
    return partial.toJSON();
  }
}

function getPartial <T> (parent: ParameterizedTypeAlias<T>, ...typeInstances: Type<any>[]): PartialType<T> {

  const {typeCreator, context, name} = parent;
  const partial = new PartialType(context);
  partial.name = name;
  partial.type = typeCreator(partial);
  partial.constraints = parent.constraints;

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
