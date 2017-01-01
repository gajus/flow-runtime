/* @flow */

import Declaration from './Declaration';
import TypeParameterApplication from '../types/TypeParameterApplication';
import getErrorMessage from "../getErrorMessage";

import type {Type, ObjectType} from '../types';

import type {Property} from '../types/ObjectType';

import type Validation, {IdentifierPath} from '../Validation';

export default class ClassDeclaration<O: {}> extends Declaration {
  typeName: string = 'ClassDeclaration';

  name: string;
  superClass: ? Type<{}>;
  body: ObjectType<O>;


  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {body} = this;
    const superClass = this.superClass && this.superClass.unwrap();
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_INSTANCEOF', this.name));
      return true;
    }
    let hasSuperErrors = false;
    if (superClass && superClass.collectErrors(validation, path, input)) {
      // Clear any errors for properties we override in this class.
      let didClear = false;
      for (const property of body.properties) {
        if (validation.clearError(path.concat(property.key))) {
          didClear = true;
        }
      }
      hasSuperErrors = didClear ? validation.hasErrors(path) : true;
    }
    if (body.collectErrors(validation, path, input)) {
      return true;
    }
    return hasSuperErrors;
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

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, O> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  toString (withDeclaration?: boolean) {
    const {name, superClass, body} = this;
    const superClassName = superClass && ((typeof superClass.name === 'string' && superClass.name) || superClass.toString());
    return `${withDeclaration ? 'declare ' : ''}class ${name}${superClassName ? `extends ${superClassName} ` : ''} ${body.toString()}`;
  }
}
