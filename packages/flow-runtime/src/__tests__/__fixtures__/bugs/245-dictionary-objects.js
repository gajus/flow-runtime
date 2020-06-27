/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass(t: TypeContext) {
  // { [string]: ?string }
  const nonExactType = t.exactObject(t.indexer("key", t.string(), t.nullable(t.string())))
  nonExactType.assert( { a: 'a' } );

  // {| [string]: ?string |}
  const exactType = t.exactObject(t.indexer("key", t.string(), t.nullable(t.string())))
  return exactType.assert( { a: 'a' } );
}

export function fail(t: TypeContext) {
  // {| [string]: ?string |}
  const type = t.exactObject(t.indexer("key", t.string(), t.nullable(t.string())))
  return type.assert( { a: {} } );
}
