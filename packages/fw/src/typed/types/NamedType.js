
import Type from './Type';
import type {Constructor, TypeConstraint} from './';

import TypeParameterApplication from './TypeParameterApplication';

export default class NamedType extends Type {
  typeName: string = 'NamedType';
  name: string;
  type: Type;
  constraints: TypeConstraint[] = [];

  addConstraint (constraint: TypeConstraint): NamedType {
    this.constraints.push(constraint);
    return this;
  }

  match (input: any): boolean {
    const {constraints, type} = this;
    if (!type.match(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        return false;
      }
    }
    return true;
  }


  matchType (input: Type): boolean {
    return this.type.matchType(input);
  }

  apply (...typeInstances: Type[]): TypeParameterApplication {
    const target = new TypeParameterApplication(this.context);
    target.parent = this;
    target.typeInstances = typeInstances;
    return target;
  }

  makeErrorMessage (): string {
    return `Invalid value for type: ${this.name}.`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this.type.resolve();
  }

  toString (withDeclaration?: boolean): string {
    const {name, type} = this;
    if (withDeclaration) {
      return `type ${name} = ${type.toString()};`;
    }
    else {
      return name;
    }
  }

  toJSON () {
    return {
      typeName: this.typeName,
      name: this.name,
      type: this.type
    };
  }
}
