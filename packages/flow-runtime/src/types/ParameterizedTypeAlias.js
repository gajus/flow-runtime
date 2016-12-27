
import Type from './Type';
import type {Constructor, TypeCreator} from './';
import type Validation, {IdentifierPath} from '../Validation';
import TypeAlias from './TypeAlias';
import PartialType from './PartialType';
import type ObjectTypeProperty from './ObjectTypeProperty';

export default class ParameterizedTypeAlias <T: Type> extends TypeAlias {
  typeName: string = 'ParameterizedTypeAlias';

  typeCreator: TypeCreator<T>;

  get partial (): PartialType<T> {
    const {typeCreator, name} = this;
    const target = new PartialType(this.context);
    target.name = name;
    target.type = typeCreator(target);
    return target;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {constraints, partial} = this;
    if (partial.collectErrors(validation, path, input)) {
      return true;
    }
    const {length} = constraints;
    let hasErrors = false;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (!constraint(input)) {
        validation.addError(path, this, 'ERR_CONSTRAINT_VIOLATION');
        hasErrors = true;
      }
    }
    return hasErrors;
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

  hasProperty (name: string, ...typeInstances: Type<any>[]): boolean {
    const inner = this.resolve(...typeInstances);
    if (inner && typeof inner.hasProperty === 'function') {
      return inner.hasProperty(name, ...typeInstances);
    }
    else {
      return false;
    }
  }

  getProperty (name: string, ...typeInstances: Type<any>[]): ? ObjectTypeProperty<any> {
    const inner = this.resolve(...typeInstances);
    if (inner && typeof inner.getProperty === 'function') {
      return inner.getProperty(name, ...typeInstances);
    }
  }

  /**
   * Get the inner type or value.
   */
  resolve (...typeInstances: Type<any>[]): Type | Constructor {
    return this.partial.resolve(...typeInstances);
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
