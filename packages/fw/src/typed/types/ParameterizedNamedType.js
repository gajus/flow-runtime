
import Type from './Type';
import type {Constructor, TypeCreator} from './';
import NamedType from './NamedType';
import PartialType from './PartialType';

export default class ParameterizedNamedType <T: Type> extends NamedType {
  typeName: string = 'ParameterizedNamedType';

  typeCreator: TypeCreator<T>;

  get partial (): PartialType<T> {
    const {typeCreator, name} = this;
    const target = new PartialType(this.context);
    target.name = name;
    target.type = typeCreator(target);
    return target;
  }

  accepts (input: any): boolean {
    const {constraints, partial} = this;
    if (!partial.accepts(input)) {
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


  acceptsType (input: Type): boolean {
    return this.partial.acceptsType(input);
  }

  makeErrorMessage (): string {
    return `Invalid value for polymorphic type: ${this.toString()}.`;
  }

  /**
   * Get the inner type or value.
   */
  resolve (): Type | Constructor {
    return this.partial.resolve();
  }

  toString (withDeclaration?: boolean): string {
    const {name, partial} = this;
    const {typeParameters} = partial;
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
    if (withDeclaration) {
      return `type ${name}<${items.join(', ')}> = ${partial.toString()};`;
    }
    else {
      return `${name}<${items.join(', ')}>`;
    }
  }

  toJSON () {
    const {partial} = this;
    return partial.toJSON();
  }
}
