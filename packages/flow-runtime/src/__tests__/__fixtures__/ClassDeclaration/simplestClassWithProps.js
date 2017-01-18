/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

  class Point {
    @t.decorate(t.number())
    x: any;

    @t.decorate(t.number())
    y: any;
  }

  const point = new Point();
  point.x = 123;
  point.y = 456;

  return point;
}


export function fail (t: TypeContext) {

  class Point {
    @t.decorate(t.number())
    x: any;

    @t.decorate(t.number())
    y: any;
  }

  const point = new Point();
  point.x = 123;
  point.y = 'nope';

  return point;
}