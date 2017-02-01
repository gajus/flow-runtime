/* @flow */

import type TypeContext from '../../../TypeContext';

function makeType (t: TypeContext) {
   const NumberStringType = t.tuple(
    t.number(),
    t.string()
  );

  const Pairer = t.function((fn) => {
    const V = fn.typeParameter('V');
    return [
      t.param('v', t.flowInto(V)),
      t.return(t.tuple(V, V))
    ];
  });

  return t.$tupleMap(NumberStringType, Pairer).unwrap();
}

export function pass (t: TypeContext) {
  const PairedType = makeType(t);
  PairedType.assert([
    [1, 1],
    ['foo', 'bar']
  ]);
  return PairedType.typeName === 'TupleType';
}


export function fail (t: TypeContext) {
 const PairedType = makeType(t);
  return PairedType.assert([
    ['nope', 'bar'],
    [false]
  ]);
}