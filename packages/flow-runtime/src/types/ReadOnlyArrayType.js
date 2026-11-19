/* @flow */
import ArrayType from './ArrayType';

export default class ReadOnlyArrayType<T> extends ArrayType<T> {
  typeName: string = 'ReadOnlyArrayType';

  assertValue (input: any): any {
    return Object.freeze(Array.prototype.slice.call(input));
  }

  toString (): string {
    return `$ReadOnlyArray<${this.elementType.toString()}>`;
  }
}
