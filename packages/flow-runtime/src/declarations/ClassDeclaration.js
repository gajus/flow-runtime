/* @flow */

import Declaration from './Declaration';
import TypeParameterApplication from '../types/TypeParameterApplication';
import getErrorMessage from "../getErrorMessage";
import compareTypes from '../compareTypes';

import type ParameterizedClassDeclaration from './ParameterizedClassDeclaration';

import type {Type, ObjectType} from '../types';

import type {Property} from '../types/ObjectType';

import type Validation, {IdentifierPath, ErrorTuple} from '../Validation';

export default class ClassDeclaration<O: {}> extends Declaration {
  typeName: string = 'ClassDeclaration';

  name: string;
  superClass: ? Type<any>;
  body: ObjectType<O>;

  shapeID: Symbol = Symbol();

  get properties (): Array<*> {
    const {body, superClass} = this;
    if (superClass == null) {
      return body.properties;
    }
    const bodyProps = body.properties;
    const superProps = (superClass.unwrap(): $FlowFixme).properties;
    if (superProps == null) {
      return bodyProps;
    }
    const seen = {};
    const seenStatic = {};
    const props = [];
    for (let i = 0; i < superProps.length; i++) {
      const prop = superProps[i];
      props.push(prop);
      if (prop.static) {
        seenStatic[prop.key] = i;
      }
      else {
        seen[prop.key] = i;
      }
    }
    for (let i = 0; i < bodyProps.length; i++) {
      const prop = bodyProps[i];
      if (seen[prop.key]) {
        props[i] = prop;
      }
      else {
        props.push(prop);
      }
    }
    return props;
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    const {body} = this;
    const superClass = this.superClass && this.superClass.unwrap();
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', this.name), this];
      return;
    }
    if (superClass) {
      for (const [errorPath, errorMessage, expectedType] of superClass.errors(validation, path, input)) {
        const propertyName = errorPath[path.length];
        if (body.getProperty(propertyName)) {
          continue;
        }
        else {
          yield [errorPath, errorMessage, expectedType];
        }
      }
    }
    yield* body.errors(validation, path, input);
  }

  accepts (input: any): boolean {
    const {body} = this;
    const superClass = this.superClass && this.superClass.unwrap();
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    else if (superClass && !superClass.accepts(input)) {
      return false;
    }
    else if (!body.accepts(input)) {
      return false;
    }
    else {
      return true;
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (input instanceof ClassDeclaration) {
      if (input === this) {
        return 0;
      }
      else if (this.isSuperClassOf(input)) {
        return 1;
      }
      else {
        return -1;
      }
    }
    return compareTypes(this.body, input);
  }

  /**
   * Get a property with the given name, or undefined if it does not exist.
   */
  getProperty (key: string | number): ? Property<$Keys<O>, any> {
    const {body, superClass} = this;
    const prop = body.getProperty(key);
    if (prop) {
      return prop;
    }
    else if (superClass && typeof superClass.getProperty === 'function') {
      return superClass.getProperty(key);
    }
  }

  /**
   * Determine whether a property with the given name exists.
   */
  hasProperty (key: string): boolean {
    const {body, superClass} = this;
    if (body.hasProperty(key)) {
      return true;
    }
    else if (superClass && typeof superClass.hasProperty === 'function') {
      return superClass.hasProperty(key);
    }
    else {
      return false;
    }
  }

  /**
   * Determine whether this class declaration represents a super class of
   * the given type.
   */
  isSuperClassOf <X: {}> (candidate: ClassDeclaration<X> | ParameterizedClassDeclaration<*, X>) {
    const {body, shapeID} = this;
    let current = candidate;

    while (current != null) {
      if (current === this || current === body || current.shapeID === shapeID) {
        return true;
      }
      if (current instanceof ClassDeclaration) {
        current = current.superClass;
      }
      else {
        current = current.unwrap();
      }
    }
    return false;
  }

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, O> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  toString (withDeclaration?: boolean) {
    const {name, superClass, body} = this;
    if (withDeclaration) {
      const superClassName = superClass && ((typeof superClass.name === 'string' && superClass.name) || superClass.toString());
      return `declare class ${name}${superClassName ? ` extends ${superClassName}` : ''} ${body.toString()}`;
    }
    else {
      return name;
    }
  }
}
