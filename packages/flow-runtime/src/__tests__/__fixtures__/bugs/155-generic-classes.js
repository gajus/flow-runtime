/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass(t: TypeContext) {
  const A = t.declare(t.class('A', t.object(
    t.property('foo', t.string()),
    t.property('bar', t.function(t.return(t.number())))
  )));


  function foo(input) {
    let _inputType = t.ref(A);

    const _returnType = t.return(t.ref(A));

    t.param("input", _inputType).assert(input);

    return _returnType.assert(input);
  }


  function bar(input) {
    let _inputType = t.ref("A");

    const _returnType = t.return(t.ref("A"));

    t.param("input", _inputType).assert(input);

    return _returnType.assert(input);
  }

  const input = {
    foo: 'abc',
    bar() {}
  };

  return foo(bar(input));
}


export function fail (t: TypeContext) {
  const A = t.declare(
    t.class(
      "A",
      t.object(
        t.property("foo", t.string()),
        t.property("bar", t.function(t.return(t.string())))
      )
    )
  );

  @t.annotate(
    t.class(
      "B",
      t.property("foo", t.string()),
      t.method("bar", t.return(t.string()))
    )
  )
  class B {
    @t.decorate(t.number())
    foo = 123;
    bar() {
      const _returnType = t.return(t.string());
      return _returnType.assert('nope');
    }
  }


  function foo(input) {
    let _inputType = t.ref(A);
    const _returnType = t.return(t.ref(A));

    t.param("input", _inputType).assert(input);

    return _returnType.assert(input);
  }

  function bar(input) {
    let _inputType = t.ref(A);

    const _returnType = t.return(t.ref(A));

    t.param("input", _inputType).assert(input);

    return _returnType.assert(input);
  }

  const input = new B();

  return foo(bar(input));
}