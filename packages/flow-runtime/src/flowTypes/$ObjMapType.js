/* @flow */

import Type from '../types/Type';
import ObjectType from '../types/ObjectType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';

import ObjectTypeProperty from '../types/ObjectTypeProperty';
import FunctionType from '../types/FunctionType';


import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

type Mapper = <V: any, R: any> (v: V) => R;

// Map over the keys in an object.

export default class $ObjMapType<O: {}, M: Mapper> extends Type<$ObjMap<O, M>> {
  typeName: string = '$ObjMapType';

  object: Type<O>;
  mapper: Type<M>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    let {object, mapper, context} = this;
    const target = object.unwrap();
    invariant(target instanceof ObjectType, 'Target must be an object type.');

    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
      return;
    }

    for (const prop: ObjectTypeProperty<*, *> of target.properties) {
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      const returnType = applied.invoke(context.literal(prop.key));

      const value = input[prop.key];
      yield* returnType.errors(validation, path.concat(prop.key), value);
    }
  }

  accepts (input: any): boolean {
    let {object, mapper, context} = this;
    const target = object.unwrap();
    invariant(target instanceof ObjectType, 'Target must be an object type.');

    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }

    for (const prop: ObjectTypeProperty<*, *> of target.properties) {
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      const returnType = applied.invoke(context.literal(prop.key));

      const value = input[prop.key];
      if (!returnType.accepts(value)) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$ObjMap<O, M>> {

    let {object, mapper, context} = this;
    const target = object.unwrap();
    invariant(target instanceof ObjectType, 'Target must be an object type.');

    const args = [];

    for (const prop: ObjectTypeProperty<*, *> of target.properties) {
      const applied = mapper.unwrap();
      invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

      args.push(context.property(
        prop.key,
        applied.invoke(context.literal(prop.key))
      ));
    }

    return context.object(...args);
  }

  toString (): string {
    return `$ObjMap<${this.object.toString()}, ${this.mapper.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      object: this.object,
      mapper: this.mapper
    };
  }
}