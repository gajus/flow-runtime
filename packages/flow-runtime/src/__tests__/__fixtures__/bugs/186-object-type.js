/* @flow */

import type TypeContext from "../../../TypeContext";

function getSchemaType(t) {
  const userIdType = t.type("UserId", t.string());
  const userType = t.type("User", t.object(t.property("id", userIdType)));
  return t.type(
    "MySchema",
    t.object(t.property("users", t.object(t.indexer("key", userIdType, userType))))
  );
}

export function pass(t: TypeContext) {
  return getSchemaType(t).assert({ users: { 'x': {id: 'x'} } });
}

export function fail(t: TypeContext) {
  return getSchemaType(t).assert({ users: [] });
}
