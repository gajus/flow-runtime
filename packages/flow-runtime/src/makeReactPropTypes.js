/* @flow */

import makeError from './makeError';

import type ObjectType from './types/ObjectType';

export type PropType<T: {}> = (props: T, propName: string, componentName: string) => ? Error;

export type PropTypeDict<T: {}> = $ObjMap<T, <V>(v: V) => PropType<V>>;

export default function makeReactPropTypes <T: {}> (objectType: ObjectType<T>): PropTypeDict<T> {
  const output = {};
  if (!objectType.properties) {
    return output;
  }
  for (const property of objectType.properties) {
    output[property.key] = (props, propName, componentName) => {
      return makeError(property, props);
    };
  }
  return output;
}