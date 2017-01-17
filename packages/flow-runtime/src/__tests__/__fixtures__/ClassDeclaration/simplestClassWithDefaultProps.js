/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {

  class Point {
    @t.decorate(t.number())
    x: any = 0;

    @t.decorate(t.number())
    y: any = 0;
  }

  const point = new Point();
  point.x = 123;
  point.y = 456;

  return point;
}


export function fail (t: TypeContext) {

  class Point {
    @t.decorate(t.number())
    x: any = 123;

    @t.decorate(t.number())
    y: any = 'nope';
  }

  const point = new Point();

  console.log(point.x, point.y);

  return point;
}