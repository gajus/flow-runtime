
import Type from './Type';
import type {Constructor} from './';

import TypeParameter from './TypeParameter';
import TypeParameterApplication from './TypeParameterApplication';

export default class PartialType<T: Type> extends Type {
  typeName: string = 'PartialType';
  name: string;
  type: T;
  typeParameters: TypeParameter[] = [];

  typeParameter (id: string, bound?: Type): TypeParameter {
    const target = new TypeParameter(this.context);
    target.id = id;
    target.bound = bound;
    this.typeParameters.push(target);
    return target;
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  accepts (input: any): boolean {
    const {type} = this;
    return type.accepts(input);
  }

  acceptsType (input: Type): boolean {
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
  resolve (): Type | Constructor {
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