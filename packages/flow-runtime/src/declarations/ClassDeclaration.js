/* @flow */

import Declaration from './Declaration';
import TypeParameterApplication from '../types/TypeParameterApplication';
import getErrorMessage from "../getErrorMessage";

import type {Type, ObjectType} from '../types';

import type Validation, {IdentifierPath} from '../Validation';

export default class ClassDeclaration<O: Object> extends Declaration {
  typeName: string = 'ClassDeclaration';

  name: string;
  superClass: ? Type<Object>;
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

  apply <X> (...typeInstances: Type<X>[]): TypeParameterApplication<X, O> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  toString () {
    const {name, superClass, body} = this;
    const superClassName = superClass && ((typeof superClass.name === 'string' && superClass.name) || superClass.toString());
    return `class ${name}${superClassName ? `extends ${superClassName} ` : ''} ${body.toString()}`;
  }
}
