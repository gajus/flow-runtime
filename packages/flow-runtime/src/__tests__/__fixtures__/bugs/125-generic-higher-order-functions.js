/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const Foo = t.type("Foo", Foo => {
    const U = Foo.typeParameter("U");
    return t.object(t.property("bar", U));
  });

  const CallFoo = t.annotate(
    function CallFoo(fooFn) {
      const U = t.typeParameter("U");

      let _fooFnType = t.function(t.return(t.ref(Foo, t.flowInto(U))));

      t.param("fooFn", _fooFnType).assert(fooFn);
      return () => {
        fooFn();
      };
    },
    t.function(_fn => {
      const U = _fn.typeParameter("U");

      return [t.param("fooFn", t.function(t.return(t.ref(Foo, t.flowInto(U)))))];
    })
  );

  const fooFn = t.annotate(function fooFn() {
    const _returnType = t.return(t.ref(Foo, t.number()));

    return _returnType.assert({
      bar: 2
    });
  }, t.function(t.return(t.ref(Foo, t.number()))));

  return CallFoo(fooFn);
}
