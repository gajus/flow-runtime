
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
    target.constraints = this.constraints;
    return target;
  }

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    return this.partial.collectErrors(validation, path, input);
  }

  accepts (input: any): boolean {
    const {constraints, partial} = this;
    if (!partial.accepts(input)) {
      return false;
    }
    const {length} = constraints;
    for (let i = 0; i < length; i++) {
      const constraint = constraints[i];
      if (typeof constraint(input) === 'string') {
        return false;
      }
    }
    return true;
  }


  acceptsType (input: Type<any>): boolean {
    return this.partial.acceptsType(input);
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
  unwrap (...typeInstances: Type<any>[]): Type<any> | Constructor {
    return this.partial.unwrap(...typeInstances);
  }

  toString (withDeclaration?: boolean): string {
    const {name, partial} = this;
    const {typeParameters} = partial;
    const items = [];
    for (let i = 0; i < typeParameters.length; i++) {
      const typeParameter = typeParameters[i];
      items.push(typeParameter.toString(true));
    }
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
    const {partial} = this;
    return partial.toJSON();
  }
}
