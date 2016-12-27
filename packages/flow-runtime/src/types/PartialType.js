
import Type from './Type';
import type {Constructor} from './';
import type Validation, {IdentifierPath} from '../Validation';

import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';

export default class PartialType<X, T> extends Type {
  typeName: string = 'PartialType';
  name: string;
  type: Type<T>;
  typeParameters: TypeParameter<X>[] = [];

  typeParameter (id: string, bound?: Type<X>): TypeParameter<X> {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    this.typeParameters.push(target);
    return target;
  }

  apply (...typeInstances: Type<X>[]): TypeParameterApplication<X, T> {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {type} = this;
    return type.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  acceptsType (input: Type<any>): boolean {
    return this.type.acceptsType(input);
  }

  makeErrorMessage (): string {
    const {type} = this;
    if (type) {
      return type.makeErrorMessage();
    }
    else {
      return `Invalid value for partial type: ${this.name}.`;
    }
  }

  toString (expand?: boolean): string {
    const {type} = this;
    return type.toString(expand);
  }

  /**
   * Get the inner type or value.
   */
  resolve (...typeInstances: Type<any>[]): Type | Constructor {
    const {length} = typeInstances;
    for (let i = 0; i < length; i++) {
      const typeParameter = this.typeParameters[i];
      if (typeParameter) {
        typeParameter.recorded = typeInstances[i];
      }
    }
    return this.type.resolve();
  }

  toJSON () {
    return {
      typeName: this.typeName,
      typeParameters: this.typeParameters,
      type: this.type
    };
  }
}