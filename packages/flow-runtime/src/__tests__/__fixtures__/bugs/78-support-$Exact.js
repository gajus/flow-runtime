/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
 const Demo = t.type("Demo", t.$exact(t.object(t.property("a", t.number(123)))));

 return Demo.assert({
   a: 123
 });
}


export function fail (t: TypeContext) {
 const Demo = t.type("Demo", t.$exact(t.object(t.property("a", t.number(123)))));

 return Demo.assert({ a: 123 , b: 456});
}