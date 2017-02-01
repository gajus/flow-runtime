import t from "flow-runtime";
t.declare(t.type("$FlowIssue", t.$flowFixMe()));
t.declare(t.type("$FlowIgnore", t.$flowFixMe()));
t.declare(t.type("$FlowFixme", t.$flowFixMe()));
t.declare(t.type("$Fixme", t.$flowFixMe()));
t.declare(
  t.class("WeakMap", _WeakMap => {
    const K = _WeakMap.typeParameter("K"), V = _WeakMap.typeParameter("V");

    return [
      t.object(
        t.property(
          "delete",
          t.function(t.param("key", K), t.return(t.boolean()))
        ),
        t.property(
          "get",
          t.function(t.param("key", K), t.return(t.union(V, t.void())))
        ),
        t.property("has", t.function(t.param("key", K), t.return(t.boolean()))),
        t.property(
          "set",
          t.function(
            t.param("key", K),
            t.param("value", V),
            t.return(t.ref("WeakMap", K, V))
          )
        )
      )
    ];
  })
);

