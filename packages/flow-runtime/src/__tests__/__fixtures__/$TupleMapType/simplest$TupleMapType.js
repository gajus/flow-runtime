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

  return t.$tupleMap(NumberStringType, Pairer);
}

export function pass (t: TypeContext) {
  const PairedType = makeType(t);
  return PairedType.assert([
    [1, 1],
    ['foo', 'bar']
  ]);
}


export function fail (t: TypeContext) {
 const PairedType = makeType(t);
  return PairedType.assert([
    ['nope', 'bar'],
    [false]
  ]);
}