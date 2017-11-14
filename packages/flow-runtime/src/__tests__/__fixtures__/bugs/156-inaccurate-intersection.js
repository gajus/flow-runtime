/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

 const Foo = t.type("Foo", t.object(t.property("val1", t.string())));
 const Bar = t.type("Bar", t.object(t.property("val2", t.string())));
 const Baz = t.type("Baz", t.intersection(Foo, Bar));
 const MyProps = t.type("MyProps", t.object(t.property("baz", Baz)));

 return MyProps.assert({ baz: { val1: "a", val2: "b" } });
}


export function fail (t: TypeContext) {

 const Foo = t.type("Foo", t.object(t.property("val1", t.string())));
 const Bar = t.type("Bar", t.object(t.property("val2", t.string())));
 const Baz = t.type("Baz", t.intersection(Foo, Bar));
 const MyProps = t.type("MyProps", t.object(t.property("baz", Baz)));

 return MyProps.assert({ baz: { val1: "a", val2: false } });
}