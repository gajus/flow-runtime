/* @flow */

import type TypeContext from "../../../TypeContext";

export function pass(t: TypeContext) {
  const schemaType = t.type(
    "MySchema",
    t.object(t.property("foo", t.nullable(t.string())))
  );
  const property = schemaType.getProperty("foo");
  property.unwrap().assert("hello world");
  return property.unwrap().assert(null) === null;
}

export function fail(t: TypeContext) {
  const schemaType = t.type("MySchema", t.object(t.property("foo", t.nullable(t.string()))));
  const property = schemaType.getProperty("foo");
  property.unwrap().assert("hello world");
  return property.unwrap().assert(false) === false;
}
