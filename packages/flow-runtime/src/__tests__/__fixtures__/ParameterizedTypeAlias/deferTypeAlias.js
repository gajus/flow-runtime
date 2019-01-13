/* @flow */

import type TypeContext from "../../../TypeContext";

export function pass(t: TypeContext) {
  const IteratorResult = t.type("IteratorResult", IteratorResult => {
    const Yield = IteratorResult.typeParameter("Yield"),
      Return = IteratorResult.typeParameter("Return");
    return t.union(t.object(t.property("done", t.boolean(true)), t.property("value", Return, true)), t.object(t.property("done", t.boolean(false)), t.property("value", Yield)));
  });
  const $Iterator = t.type("$Iterator", $Iterator => {
    const Yield = $Iterator.typeParameter("Yield"),
      Return = $Iterator.typeParameter("Return"),
      Next = $Iterator.typeParameter("Next");
    return t.object(t.property(Symbol.iterator, t.function(t.return(t.ref($Iterator, Yield, Return, Next)))), t.property("next", t.function(t.param("value", Next, true), t.return(t.ref(IteratorResult, Yield, Return)))));
  });
  t.type("Iterator", Iterator => {
    const T = Iterator.typeParameter("T");
    return t.ref($Iterator, T, t.void(), t.void());
  });
  const $Iterable = t.type("$Iterable", $Iterable => {
    const Yield = $Iterable.typeParameter("Yield"),
      Return = $Iterable.typeParameter("Return"),
      Next = $Iterable.typeParameter("Next");
    return t.object(
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref($Iterator, Yield, Return, Next)))
      )
    );
  });
  const Iterable = t.type("Iterable", Iterable => {
    const T = Iterable.typeParameter("T");
    return t.ref($Iterable, T, t.void(), t.void());
  });
  t.declare(
    "$await",
    t.function(_fn15 => {
      const T = _fn15.typeParameter("T");

      return [t.param("p", t.union(t.ref("Promise", T), T)), t.return(T)];
    })
  );
  t.declare(
    t.class("Promise", _Promise => {
      const R = _Promise.typeParameter("R");

      return [
        t.object(
          t.property(
            "constructor",
            t.function(
              t.param(
                "callback",
                t.function(
                  t.param(
                    "resolve",
                    t.function(
                      t.param("result", t.union(t.ref("Promise", R), R)),
                      t.return(t.void())
                    )
                  ),
                  t.param(
                    "reject",
                    t.function(t.param("error", t.any()), t.return(t.void()))
                  ),
                  t.return(t.mixed())
                )
              ),
              t.return(t.void())
            )
          ),
          t.property(
            "then",
            t.function(_fn16 => {
              const U = _fn16.typeParameter("U");

              return [
                t.param(
                  "onFulfill",
                  t.function(
                    t.param("value", R),
                    t.return(t.union(t.ref("Promise", U), U))
                  ),
                  true
                ),
                t.param(
                  "onReject",
                  t.function(
                    t.param("error", t.any()),
                    t.return(t.union(t.ref("Promise", U), U))
                  ),
                  true
                ),
                t.return(t.ref("Promise", U))
              ];
            })
          ),
          t.property(
            "catch",
            t.function(_fn17 => {
              const U = _fn17.typeParameter("U");

              return [
                t.param(
                  "onReject",
                  t.function(
                    t.param("error", t.any()),
                    t.return(t.union(t.ref("Promise", U), U))
                  ),
                  true
                ),
                t.return(t.ref("Promise", t.union(R, U)))
              ];
            })
          ),
          t.staticProperty(
            "resolve",
            t.function(_fn18 => {
              const T = _fn18.typeParameter("T");

              return [
                t.param("object", t.union(t.ref("Promise", T), T)),
                t.return(t.ref("Promise", T))
              ];
            })
          ),
          t.staticProperty(
            "reject",
            t.function(_fn19 => {
              const T = _fn19.typeParameter("T");

              return [
                t.param("error", t.any(), true),
                t.return(t.ref("Promise", T))
              ];
            })
          ),
          t.staticProperty(
            "all",
            t.function(_fn20 => {
              const T = _fn20.typeParameter("T", t.ref(Iterable, t.mixed()));

              return [
                t.param("promises", T),
                t.return(t.ref("Promise", t.$tupleMap(T, t.ref("$await"))))
              ];
            })
          ),
          t.staticProperty(
            "race",
            t.function(_fn21 => {
              const T = _fn21.typeParameter("T"),
                Elem = _fn21.typeParameter(
                  "Elem",
                  t.union(t.ref("Promise", T), T)
                );

              return [
                t.param("promises", t.array(Elem)),
                t.return(t.ref("Promise", T))
              ];
            })
          )
        )
      ];
    })
  );
  const Deferred = t.type("Deferred", Deferred => {
    const T = Deferred.typeParameter("T");
    return t.object(
      t.property("promise", t.ref("Promise", T)),
      t.property(
        "resolve",
        t.function(t.param("_arg0", T), t.return(t.void()))
      ),
      t.property(
        "reject",
        t.function(t.param("_arg0", t.ref("Error")), t.return(t.void()))
      )
    );
  });

  function defer() {
    const T = t.typeParameter("T");

    const _returnType = t.return(t.ref(Deferred, T));

    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    return _returnType.assert(deferred);
  }

  t.annotate(
    defer,
    t.function(_fn => {
      const T = _fn.typeParameter("T");

      return [t.return(t.ref(Deferred, T))];
    })
  );

  const def = defer();
  def.resolve(true);
  return defer().promise.then(a => console.log("zzz", a));
}
