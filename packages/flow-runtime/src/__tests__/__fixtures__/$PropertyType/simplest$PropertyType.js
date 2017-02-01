/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ThingType = t.object({
    id: t.number(),
    name: t.string(),
  });

  const ThingNameType = t.$propertyType(ThingType, 'name');

  return ThingNameType.assert('this is fine');
}


export function fail (t: TypeContext) {
 const ThingType = t.object({
    id: t.number(),
    name: t.string(),
  });

  const ThingNameType = t.$propertyType(ThingType, 'name');

  return ThingNameType.assert(false);
}