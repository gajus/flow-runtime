/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ThingType = t.type('Thing', t.object({
    id: t.number(),
    name: t.string(),
  }));

  const ThingIdType = t.$propertyType(ThingType, 'id');

  return ThingIdType.assert(123);
}


export function fail (t: TypeContext) {
 const ThingType = t.object({
    id: t.number(),
    name: t.string(),
  });

  const ThingIdType = t.$propertyType(ThingType, 'id');

  return ThingIdType.assert('this is bad');
}