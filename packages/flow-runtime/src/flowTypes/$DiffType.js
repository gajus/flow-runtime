/* @flow */

import Type from '../types/Type';
import ObjectType from '../types/ObjectType';
import getErrorMessage from '../getErrorMessage';
import compareTypes from '../compareTypes';

import invariant from '../invariant';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

// If A and B are object types, $Diff<A,B> is the type of objects that have
// properties defined in A, but not in B.
// Properties that are defined in both A and B are allowed too.

export default class $DiffType<A: {}, B: {}> extends Type<$Diff<A, B>> {
  typeName: string = '$DiffType';

  aType: Type<A>;
  bType: Type<B>;

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    let {aType, bType} = this;
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
      return;
    }
    aType = aType.unwrap();
    bType = bType.unwrap();
    invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
    const properties = aType.properties;
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (bType.hasProperty(property.key)) {
        continue;
      }
      yield* property.errors(validation, path.concat(property.key), input);
    }
  }

  accepts (input: any): boolean {
    let {aType, bType} = this;
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    aType = aType.unwrap();
    bType = bType.unwrap();
    invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
    const properties = aType.properties;
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (bType.hasProperty(property.key)) {
        continue;
      }
      if (!property.accepts(input)) {
        return false;
      }
    }
    return true;
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    return compareTypes(this.unwrap(), input);
  }

  unwrap (): Type<$Diff<A, B>> {
    let {aType, bType} = this;
    aType = aType.unwrap();
    bType = bType.unwrap();
    invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
    const properties = aType.properties;
    const args = [];
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (bType.hasProperty(property.key)) {
        continue;
      }
      args.push(property);
    }
    return this.context.object(...args);
  }

  toString (): string {
    return `$Diff<${this.aType.toString()}, ${this.bType.toString()}>`;
  }

  toJSON () {
    return {
      typeName: this.typeName,
      aType: this.aType,
      bType: this.bType
    };
  }
}