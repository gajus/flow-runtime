/* @flow */

import type TypeContext from '../../../TypeContext';
import {throws} from 'assert';

function makeClasses() {
  class A {
    constructor(x) {
      this.data = x;
    }
  }
  
  class B {
    constructor(x) {
      this.data = x;
    }
  }
  return [A, B];
}

function makeAnnotatedClasses(t: TypeContext) {
  const [A, B] = makeClasses();

  return [
    t.annotate(t.class("A", t.property("data", t.number()), t.method("constructor", t.param("x", t.any()))))(A),
    t.annotate(t.class("B", t.property("data", t.number()), t.method("constructor", t.param("x", t.any()))))(B)
  ];
}

function allowExact(t: TypeContext, A: *, B: *) {
  const Intersect = t.type("Intersect", t.intersection(t.ref(A), t.object(t.property("data", t.number(1)))));

  return Intersect.assert(new A(1));
}

function disallowInexact(t: TypeContext, A: *, B: *) {
  const Intersect = t.type("Intersect", t.intersection(t.ref(A), t.object(t.property("data", t.number(1)))));

  return throws(() => Intersect.assert(new A(2)));
}


function disallowStructural(t: TypeContext, A: *, B: *) {
  const Intersect = t.type(
    "Intersect",
    t.intersection(t.ref(A), t.object(t.property("data", t.number(1))))
  );

  return throws(() => Intersect.assert(new B(1)));
}

export function pass(t: TypeContext) {
  allowExact(t, ...makeClasses());
  allowExact(t, ...makeAnnotatedClasses(t));
  disallowInexact(t, ...makeClasses());
  disallowInexact(t, ...makeAnnotatedClasses(t));

  disallowStructural(t, ...makeClasses());
  disallowStructural(t, ...makeAnnotatedClasses(t));
  return true;
}


export function fail (t: TypeContext) {
  const [A, B] = makeAnnotatedClasses(t);
  const Intersect = t.type("Intersect", t.intersection(t.ref(A), t.object(t.property("data", t.number(1)))));
  return Intersect.assert(new B(1));
}