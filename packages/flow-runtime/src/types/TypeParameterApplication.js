/* @flow */

import Type from './Type';
import type Validation, {IdentifierPath} from '../Validation';

import type {ApplicableType} from './';

import type ObjectTypeProperty from './ObjectTypeProperty';

/**
 * # TypeParameterApplication
 *
 */
export default class TypeParameterApplication<X, T> extends Type {
  typeName: string = 'TypeParameterApplication';
  parent: ApplicableType<T>;
  typeInstances: Type<X>[] = [];

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {parent, typeInstances} = this;
    return parent.collectErrors(validation, path, input, ...typeInstances);
  }

  accepts (input: any): boolean {
    const {parent, typeInstances} = this;
    return parent.accepts(input, ...typeInstances);
  }

  acceptsType (input: Type<any>): boolean {
    return this.parent.acceptsType(input);
  }

  hasProperty (name: string): boolean {
    const inner = this.parent;
    if (inner && typeof (inner: $FlowIgnore).hasProperty === 'function') {
      return (inner: $FlowIgnore).hasProperty(name, ...this.typeInstances);
    }
    else {
      return false;
    }
  }

  getProperty (name: string): ? ObjectTypeProperty<any> {
    const inner = this.parent;
    if (inner && typeof (inner: $FlowIgnore).getProperty === 'function') {
      return (inner: $FlowIgnore).getProperty(name, ...this.typeInstances);
    }
  }

  toString (): string {
    const {parent, typeInstances} = this;
    const {name} = parent;
    if (typeInstances.length) {
      const items = [];
      for (let i = 0; i < typeInstances.length; i++) {
        const typeInstance = typeInstances[i];
        items.push(typeInstance.toString());
      }
      return `${name}<${items.join(', ')}>`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeInstances: this.typeInstances
    };
  }
}
