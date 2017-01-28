import t from "flow-runtime";
t.declare(
  t.class("WeakMap", _WeakMap => {
    const K = _WeakMap.typeParameter("K"), V = _WeakMap.typeParameter("V");

    return [
      t.object(
        t.property("clear", t.function(t.return(t.void()))),
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
            t.return(t.ref(WeakMap, K, V))
          )
        )
      )
    ];
  })
);
const IteratorResult = t.type("IteratorResult", IteratorResult => {
  const Yield = IteratorResult.typeParameter("Yield"),
    Return = IteratorResult.typeParameter("Return");
  return t.union(
    t.object(
      t.property("done", t.boolean(true)),
      t.property("value", Return, true)
    ),
    t.object(t.property("done", t.boolean(false)), t.property("value", Yield))
  );
});
const $Iterator = t.type("$Iterator", $Iterator => {
  const Yield = $Iterator.typeParameter("Yield"),
    Return = $Iterator.typeParameter("Return"),
    Next = $Iterator.typeParameter("Next");
  return t.object(
    t.property(
      Symbol.iterator,
      t.function(t.return(t.ref($Iterator, Yield, Return, Next)))
    ),
    t.property(
      "next",
      t.function(
        t.param("value", Next, true),
        t.return(t.ref(IteratorResult, Yield, Return))
      )
    )
  );
});
const Iterator = t.type("Iterator", Iterator => {
  const T = Iterator.typeParameter("T");
  return t.ref($Iterator, T, t.void(), t.void());
});
t.declare(
  t.class(
    "Boolean",
    t.object(
      t.callProperty(
        t.function(t.param("value", t.any()), t.return(t.boolean()))
      ),
      t.property("valueOf", t.function(t.return(t.boolean()))),
      t.property("toString", t.function(t.return(t.string())))
    )
  )
);
t.declare(
  t.class("$ReadOnlyArray", _$ReadOnlyArray => {
    const T = _$ReadOnlyArray.typeParameter("T");

    return [
      t.object(
        t.property(Symbol.iterator, t.function(t.return(t.ref(Iterator, T)))),
        t.property("toLocaleString", t.function(t.return(t.string()))),
        t.property(
          "concat",
          t.function(_fn => {
            const S = _fn.typeParameter("S"),
              Item = _fn.typeParameter("Item", t.union(t.array(S), S));

            return [
              t.rest("items", t.array(Item)),
              t.return(t.array(t.union(T, S)))
            ];
          })
        ),
        t.property(
          "entries",
          t.function(t.return(t.ref(Iterator, t.tuple(t.number(), T))))
        ),
        t.property(
          "every",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.boolean())
          )
        ),
        t.property(
          "filter",
          t.function(
            t.param("callbackfn", t.typeOf(Boolean)),
            t.return(t.array(t.ref("$NonMaybeType", T)))
          )
        ),
        t.property(
          "filter",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.array(T))
          )
        ),
        t.property(
          "find",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.union(T, t.void()))
          )
        ),
        t.property(
          "findIndex",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.number())
          )
        ),
        t.property(
          "forEach",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.void())
          )
        ),
        t.property(
          "includes",
          t.function(
            t.param("searchElement", T),
            t.param("fromIndex", t.number(), true),
            t.return(t.boolean())
          )
        ),
        t.property(
          "indexOf",
          t.function(
            t.param("searchElement", T),
            t.param("fromIndex", t.number(), true),
            t.return(t.number())
          )
        ),
        t.property(
          "join",
          t.function(
            t.param("separator", t.string(), true),
            t.return(t.string())
          )
        ),
        t.property("keys", t.function(t.return(t.ref(Iterator, t.number())))),
        t.property(
          "lastIndexOf",
          t.function(
            t.param("searchElement", T),
            t.param("fromIndex", t.number(), true),
            t.return(t.number())
          )
        ),
        t.property(
          "map",
          t.function(_fn2 => {
            const U = _fn2.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("value", T),
                  t.param("index", t.number()),
                  t.param("array", t.ref("$ReadOnlyArray", T)),
                  t.return(U)
                )
              ),
              t.param("thisArg", t.any(), true),
              t.return(t.array(U))
            ];
          })
        ),
        t.property(
          "reduce",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("previousValue", T),
                t.param("currentValue", T),
                t.param("currentIndex", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(T)
              )
            ),
            t.param("initialValue", t.void()),
            t.return(T)
          )
        ),
        t.property(
          "reduce",
          t.function(_fn3 => {
            const U = _fn3.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", T),
                  t.param("currentIndex", t.number()),
                  t.param("array", t.ref("$ReadOnlyArray", T)),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        ),
        t.property(
          "reduceRight",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("previousValue", T),
                t.param("currentValue", T),
                t.param("currentIndex", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(T)
              )
            ),
            t.param("initialValue", t.void()),
            t.return(T)
          )
        ),
        t.property(
          "reduceRight",
          t.function(_fn4 => {
            const U = _fn4.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", T),
                  t.param("currentIndex", t.number()),
                  t.param("array", t.ref("$ReadOnlyArray", T)),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        ),
        t.property(
          "slice",
          t.function(
            t.param("start", t.number(), true),
            t.param("end", t.number(), true),
            t.return(t.array(T))
          )
        ),
        t.property(
          "some",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.ref("$ReadOnlyArray", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.boolean())
          )
        ),
        t.property("values", t.function(t.return(t.ref(Iterator, T)))),
        t.property("length", t.number()),
        t.indexer("key", t.number(), T)
      )
    ];
  })
);
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
  t.class("Array", _Array => {
    const T = _Array.typeParameter("T");

    return [
      t.object(
        t.callProperty(
          t.function(
            t.rest("values", t.array(t.any())),
            t.return(t.array(t.any()))
          )
        ),
        t.property(
          "copyWithin",
          t.function(
            t.param("target", t.number()),
            t.param("start", t.number()),
            t.param("end", t.number(), true),
            t.return(t.array(T))
          )
        ),
        t.property(
          "every",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.boolean())
          )
        ),
        t.property(
          "fill",
          t.function(
            t.param("value", T),
            t.param("begin", t.number(), true),
            t.param("end", t.number(), true),
            t.return(t.array(T))
          )
        ),
        t.property(
          "filter",
          t.function(
            t.param("callbackfn", t.typeOf(Boolean)),
            t.return(t.array(t.ref("$NonMaybeType", T)))
          )
        ),
        t.property(
          "filter",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.array(T))
          )
        ),
        t.property(
          "find",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.union(T, t.void()))
          )
        ),
        t.property(
          "findIndex",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.number())
          )
        ),
        t.property(
          "forEach",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.void())
          )
        ),
        t.property(
          "map",
          t.function(_fn5 => {
            const U = _fn5.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("value", T),
                  t.param("index", t.number()),
                  t.param("array", t.array(T)),
                  t.return(U)
                )
              ),
              t.param("thisArg", t.any(), true),
              t.return(t.array(U))
            ];
          })
        ),
        t.property("pop", t.function(t.return(T))),
        t.property(
          "push",
          t.function(t.rest("items", t.array(T)), t.return(t.number()))
        ),
        t.property(
          "reduce",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("previousValue", T),
                t.param("currentValue", T),
                t.param("currentIndex", t.number()),
                t.param("array", t.array(T)),
                t.return(T)
              )
            ),
            t.param("initialValue", t.void()),
            t.return(T)
          )
        ),
        t.property(
          "reduce",
          t.function(_fn6 => {
            const U = _fn6.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", T),
                  t.param("currentIndex", t.number()),
                  t.param("array", t.array(T)),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        ),
        t.property(
          "reduceRight",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("previousValue", T),
                t.param("currentValue", T),
                t.param("currentIndex", t.number()),
                t.param("array", t.array(T)),
                t.return(T)
              )
            ),
            t.param("initialValue", t.void()),
            t.return(T)
          )
        ),
        t.property(
          "reduceRight",
          t.function(_fn7 => {
            const U = _fn7.typeParameter("U");

            return [
              t.param(
                "callbackfn",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", T),
                  t.param("currentIndex", t.number()),
                  t.param("array", t.array(T)),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        ),
        t.property("reverse", t.function(t.return(t.array(T)))),
        t.property("shift", t.function(t.return(T))),
        t.property(
          "some",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("array", t.array(T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.boolean())
          )
        ),
        t.property(
          "sort",
          t.function(
            t.param(
              "compareFn",
              t.function(
                t.param("a", T),
                t.param("b", T),
                t.return(t.number())
              ),
              true
            ),
            t.return(t.array(T))
          )
        ),
        t.property(
          "splice",
          t.function(
            t.param("start", t.number()),
            t.param("deleteCount", t.number(), true),
            t.rest("items", t.array(T)),
            t.return(t.array(T))
          )
        ),
        t.property(
          "unshift",
          t.function(t.rest("items", t.array(T)), t.return(t.number()))
        ),
        t.staticProperty(
          "isArray",
          t.function(t.param("obj", t.any()), t.return(t.boolean()))
        ),
        t.staticProperty(
          "from",
          t.function(_fn8 => {
            const A = _fn8.typeParameter("A"), B = _fn8.typeParameter("B");

            return [
              t.param("iter", t.ref(Iterable, A)),
              t.param(
                "mapFn",
                t.function(
                  t.param("elem", A),
                  t.param("index", t.number()),
                  t.return(B)
                )
              ),
              t.param("thisArg", t.any(), true),
              t.return(t.array(B))
            ];
          })
        ),
        t.staticProperty(
          "from",
          t.function(_fn9 => {
            const A = _fn9.typeParameter("A");

            return [
              t.param("iter", t.ref(Iterable, A)),
              t.param("mapFn", t.void()),
              t.return(t.array(A))
            ];
          })
        ),
        t.staticProperty(
          "from",
          t.function(_fn10 => {
            const A = _fn10.typeParameter("A"), B = _fn10.typeParameter("B");

            return [
              t.param("iter", t.ref(Iterator, A)),
              t.param(
                "mapFn",
                t.function(
                  t.param("elem", A),
                  t.param("index", t.number()),
                  t.return(B)
                )
              ),
              t.param("thisArg", t.any(), true),
              t.return(t.array(B))
            ];
          })
        ),
        t.staticProperty(
          "from",
          t.function(_fn11 => {
            const A = _fn11.typeParameter("A");

            return [
              t.param("iter", t.ref(Iterator, A)),
              t.param("mapFn", t.void()),
              t.return(t.array(A))
            ];
          })
        ),
        t.staticProperty(
          "from",
          t.function(_fn12 => {
            const A = _fn12.typeParameter("A");

            return [
              t.param("arrayLike", t.object(t.property("length", t.number()))),
              t.param(
                "mapFn",
                t.function(
                  t.param("elem", t.void()),
                  t.param("index", t.number()),
                  t.return(A)
                )
              ),
              t.param("thisArg", t.any(), true),
              t.return(t.array(A))
            ];
          })
        ),
        t.staticProperty(
          "from",
          t.function(
            t.param("arrayLike", t.object(t.property("length", t.number()))),
            t.param("mapFn", t.void()),
            t.return(t.array(t.void()))
          )
        ),
        t.staticProperty(
          "of",
          t.function(
            t.rest("values", t.array(t.any())),
            t.return(t.array(t.any()))
          )
        ),
        t.indexer("key", t.number(), T)
      ),
      t.extends("$ReadOnlyArray", T)
    ];
  })
);
t.declare(t.class("$SymbolSpecies", t.object()));
t.declare(
  t.class(
    "Function",
    t.object(
      t.property("apply", t.ref("Function$Prototype$Apply")),
      t.property("bind", t.ref("Function$Prototype$Bind")),
      t.property("call", t.ref("Function$Prototype$Call")),
      t.property("arguments", t.any()),
      t.property("caller", t.union(t.ref(Function), t.null())),
      t.property("length", t.number()),
      t.property("name", t.string())
    )
  )
);
t.declare(
  t.class("Set", _Set => {
    const T = _Set.typeParameter("T");

    return [
      t.object(
        t.property(Symbol.iterator, t.function(t.return(t.ref(Iterator, T)))),
        t.property(
          "constructor",
          t.function(
            t.param("iterable", t.nullable(t.ref(Iterable, T))),
            t.return(t.void())
          )
        ),
        t.property(
          "add",
          t.function(t.param("value", T), t.return(t.ref(Set, T)))
        ),
        t.property("clear", t.function(t.return(t.void()))),
        t.property(
          "delete",
          t.function(t.param("value", T), t.return(t.boolean()))
        ),
        t.property(
          "entries",
          t.function(t.return(t.ref(Iterator, t.tuple(T, T))))
        ),
        t.property(
          "forEach",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", T),
                t.param("set", t.ref(Set, T)),
                t.return(t.mixed())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.void())
          )
        ),
        t.property(
          "has",
          t.function(t.param("value", T), t.return(t.boolean()))
        ),
        t.property("keys", t.function(t.return(t.ref(Iterator, T)))),
        t.property("size", t.number()),
        t.property("values", t.function(t.return(t.ref(Iterator, T)))),
        t.indexer("key", t.ref("$SymbolSpecies"), t.ref(Function))
      )
    ];
  })
);
t.declare(t.class("$SymbolToStringTag", t.object()));
t.declare(
  t.class("Map", _Map => {
    const K = _Map.typeParameter("K"), V = _Map.typeParameter("V");

    return [
      t.object(
        t.property(
          Symbol.iterator,
          t.function(t.return(t.ref(Iterator, t.tuple(K, V))))
        ),
        t.property(
          "constructor",
          t.function(
            t.param("iterable", t.nullable(t.ref(Iterable, t.tuple(K, V)))),
            t.return(t.void())
          )
        ),
        t.property("clear", t.function(t.return(t.void()))),
        t.property(
          "delete",
          t.function(t.param("key", K), t.return(t.boolean()))
        ),
        t.property(
          "entries",
          t.function(t.return(t.ref(Iterator, t.tuple(K, V))))
        ),
        t.property(
          "forEach",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", V),
                t.param("index", K),
                t.param("map", t.ref(Map, K, V)),
                t.return(t.mixed())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.void())
          )
        ),
        t.property(
          "get",
          t.function(t.param("key", K), t.return(t.union(V, t.void())))
        ),
        t.property("has", t.function(t.param("key", K), t.return(t.boolean()))),
        t.property("keys", t.function(t.return(t.ref(Iterator, K)))),
        t.property(
          "set",
          t.function(
            t.param("key", K),
            t.param("value", V),
            t.return(t.ref(Map, K, V))
          )
        ),
        t.property("size", t.number()),
        t.property("values", t.function(t.return(t.ref(Iterator, V)))),
        t.indexer(
          "key",
          t.union(t.ref("$SymbolToStringTag"), t.ref("$SymbolSpecies")),
          t.ref(Function)
        )
      )
    ];
  })
);
t.declare(t.class("$SymbolHasInstance", t.object()));
t.declare(t.class("$SymboIsConcatSpreadable", t.object()));
t.declare(t.class("$SymbolMatch", t.object()));
t.declare(t.class("$SymbolReplace", t.object()));
t.declare(t.class("$SymbolSearch", t.object()));
t.declare(t.class("$SymbolSplit", t.object()));
t.declare(t.class("$SymbolToPrimitive", t.object()));
t.declare(t.class("$SymbolUnscopables", t.object()));
t.declare(
  t.class(
    "Symbol",
    t.object(
      t.callProperty(
        t.function(t.param("value", t.any(), true), t.return(t.ref(Symbol)))
      ),
      t.staticProperty(
        "for",
        t.function(t.param("key", t.string()), t.return(t.ref(Symbol)))
      ),
      t.staticProperty("hasInstance", t.ref("$SymbolHasInstance")),
      t.staticProperty("isConcatSpreadable", t.ref("$SymboIsConcatSpreadable")),
      t.staticProperty("iterator", t.string()),
      t.staticProperty(
        "keyFor",
        t.function(
          t.param("sym", t.ref(Symbol)),
          t.return(t.nullable(t.string()))
        )
      ),
      t.staticProperty("length", t.number(0)),
      t.staticProperty("match", t.ref("$SymbolMatch")),
      t.staticProperty("replace", t.ref("$SymbolReplace")),
      t.staticProperty("search", t.ref("$SymbolSearch")),
      t.staticProperty("species", t.ref("$SymbolSpecies")),
      t.staticProperty("split", t.ref("$SymbolSplit")),
      t.staticProperty("toPrimitive", t.ref("$SymbolToPrimitive")),
      t.staticProperty("toStringTag", t.ref("$SymbolToStringTag")),
      t.staticProperty("unscopables", t.ref("$SymbolUnscopables")),
      t.property("toString", t.function(t.return(t.string()))),
      t.property("valueOf", t.function(t.return(t.nullable(t.ref(Symbol)))))
    )
  )
);
t.declare(
  t.class(
    "Number",
    t.object(
      t.callProperty(
        t.function(t.param("value", t.any()), t.return(t.number()))
      ),
      t.staticProperty("EPSILON", t.number()),
      t.staticProperty("MAX_SAFE_INTEGER", t.number()),
      t.staticProperty("MAX_VALUE", t.number()),
      t.staticProperty("MIN_SAFE_INTEGER", t.number()),
      t.staticProperty("MIN_VALUE", t.number()),
      t.staticProperty("NaN", t.number()),
      t.staticProperty("NEGATIVE_INFINITY", t.number()),
      t.staticProperty("POSITIVE_INFINITY", t.number()),
      t.staticProperty(
        "isFinite",
        t.function(t.param("value", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "isInteger",
        t.function(t.param("value", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "isNaN",
        t.function(t.param("value", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "isSafeInteger",
        t.function(t.param("value", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "parseFloat",
        t.function(t.param("value", t.string()), t.return(t.number()))
      ),
      t.staticProperty(
        "parseInt",
        t.function(t.param("value", t.string()), t.return(t.number()))
      ),
      t.property(
        "toExponential",
        t.function(
          t.param("fractionDigits", t.number(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "toFixed",
        t.function(
          t.param("fractionDigits", t.number(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "toPrecision",
        t.function(t.param("precision", t.number(), true), t.return(t.string()))
      ),
      t.property(
        "toString",
        t.function(t.param("radix", t.number(), true), t.return(t.string()))
      ),
      t.property("valueOf", t.function(t.return(t.number())))
    )
  )
);
const RegExp$flags = t.type(
  "RegExp$flags",
  t.union(
    t.string("i"),
    t.string("g"),
    t.string("m"),
    t.string("u"),
    t.string("y"),
    t.string("ig"),
    t.string("im"),
    t.string("iu"),
    t.string("iy"),
    t.string("gi"),
    t.string("gm"),
    t.string("gu"),
    t.string("gy"),
    t.string("mi"),
    t.string("mg"),
    t.string("mu"),
    t.string("my"),
    t.string("ui"),
    t.string("ug"),
    t.string("um"),
    t.string("uy"),
    t.string("yi"),
    t.string("yg"),
    t.string("ym"),
    t.string("yu"),
    t.string("igm"),
    t.string("igu"),
    t.string("igy"),
    t.string("img"),
    t.string("imu"),
    t.string("imy"),
    t.string("iug"),
    t.string("ium"),
    t.string("iuy"),
    t.string("iyg"),
    t.string("iym"),
    t.string("iyu"),
    t.string("giy"),
    t.string("gim"),
    t.string("giu"),
    t.string("gmy"),
    t.string("gmi"),
    t.string("gmu"),
    t.string("guy"),
    t.string("gui"),
    t.string("gum"),
    t.string("gyu"),
    t.string("gyi"),
    t.string("gym"),
    t.string("miu"),
    t.string("miy"),
    t.string("mig"),
    t.string("mgu"),
    t.string("mgy"),
    t.string("mgi"),
    t.string("mug"),
    t.string("muy"),
    t.string("mui"),
    t.string("myg"),
    t.string("myu"),
    t.string("myi"),
    t.string("uig"),
    t.string("uim"),
    t.string("uiy"),
    t.string("ugi"),
    t.string("ugm"),
    t.string("ugy"),
    t.string("umi"),
    t.string("umg"),
    t.string("umy"),
    t.string("uyi"),
    t.string("uyg"),
    t.string("uym"),
    t.string("yiu"),
    t.string("yig"),
    t.string("yim"),
    t.string("ygu"),
    t.string("ygi"),
    t.string("ygm"),
    t.string("ymu"),
    t.string("ymi"),
    t.string("ymg"),
    t.string("yum"),
    t.string("yui"),
    t.string("yug"),
    t.string("igmu"),
    t.string("igmy"),
    t.string("igum"),
    t.string("iguy"),
    t.string("igym"),
    t.string("igyu"),
    t.string("imgy"),
    t.string("imgu"),
    t.string("imuy"),
    t.string("imug"),
    t.string("imyu"),
    t.string("imyg"),
    t.string("iugm"),
    t.string("iugy"),
    t.string("iumg"),
    t.string("iumy"),
    t.string("iuyg"),
    t.string("iuym"),
    t.string("iygu"),
    t.string("iygm"),
    t.string("iymu"),
    t.string("iymg"),
    t.string("iyum"),
    t.string("iyug"),
    t.string("giym"),
    t.string("giyu"),
    t.string("gimy"),
    t.string("gimu"),
    t.string("giuy"),
    t.string("gium"),
    t.string("gmyu"),
    t.string("gmyi"),
    t.string("gmiu"),
    t.string("gmiy"),
    t.string("gmui"),
    t.string("gmuy"),
    t.string("guyi"),
    t.string("guym"),
    t.string("guiy"),
    t.string("guim"),
    t.string("gumy"),
    t.string("gumi"),
    t.string("gyum"),
    t.string("gyui"),
    t.string("gyim"),
    t.string("gyiu"),
    t.string("gymi"),
    t.string("gymu"),
    t.string("miuy"),
    t.string("miug"),
    t.string("miyu"),
    t.string("miyg"),
    t.string("migu"),
    t.string("migy"),
    t.string("mgui"),
    t.string("mguy"),
    t.string("mgyi"),
    t.string("mgyu"),
    t.string("mgiy"),
    t.string("mgiu"),
    t.string("mugy"),
    t.string("mugi"),
    t.string("muyg"),
    t.string("muyi"),
    t.string("muig"),
    t.string("muiy"),
    t.string("mygi"),
    t.string("mygu"),
    t.string("myui"),
    t.string("myug"),
    t.string("myiu"),
    t.string("myig"),
    t.string("uigm"),
    t.string("uigy"),
    t.string("uimg"),
    t.string("uimy"),
    t.string("uiyg"),
    t.string("uiym"),
    t.string("ugiy"),
    t.string("ugim"),
    t.string("ugmy"),
    t.string("ugmi"),
    t.string("ugym"),
    t.string("ugyi"),
    t.string("umig"),
    t.string("umiy"),
    t.string("umgi"),
    t.string("umgy"),
    t.string("umyi"),
    t.string("umyg"),
    t.string("uyim"),
    t.string("uyig"),
    t.string("uygm"),
    t.string("uygi"),
    t.string("uymg"),
    t.string("uymi"),
    t.string("yiug"),
    t.string("yium"),
    t.string("yigu"),
    t.string("yigm"),
    t.string("yimu"),
    t.string("yimg"),
    t.string("ygum"),
    t.string("ygui"),
    t.string("ygim"),
    t.string("ygiu"),
    t.string("ygmi"),
    t.string("ygmu"),
    t.string("ymui"),
    t.string("ymug"),
    t.string("ymiu"),
    t.string("ymig"),
    t.string("ymgu"),
    t.string("ymgi"),
    t.string("yumg"),
    t.string("yumi"),
    t.string("yuig"),
    t.string("yuim"),
    t.string("yugi"),
    t.string("yugm"),
    t.string("igmuy"),
    t.string("igmyu"),
    t.string("igumy"),
    t.string("iguym"),
    t.string("igymu"),
    t.string("igyum"),
    t.string("imgyu"),
    t.string("imguy"),
    t.string("imuyg"),
    t.string("imugy"),
    t.string("imyug"),
    t.string("imygu"),
    t.string("iugmy"),
    t.string("iugym"),
    t.string("iumgy"),
    t.string("iumyg"),
    t.string("iuygm"),
    t.string("iuymg"),
    t.string("iygum"),
    t.string("iygmu"),
    t.string("iymug"),
    t.string("iymgu"),
    t.string("iyumg"),
    t.string("iyugm"),
    t.string("giymu"),
    t.string("giyum"),
    t.string("gimyu"),
    t.string("gimuy"),
    t.string("giuym"),
    t.string("giumy"),
    t.string("gmyui"),
    t.string("gmyiu"),
    t.string("gmiuy"),
    t.string("gmiyu"),
    t.string("gmuiy"),
    t.string("gmuyi"),
    t.string("guyim"),
    t.string("guymi"),
    t.string("guiym"),
    t.string("guimy"),
    t.string("gumyi"),
    t.string("gumiy"),
    t.string("gyumi"),
    t.string("gyuim"),
    t.string("gyimu"),
    t.string("gyium"),
    t.string("gymiu"),
    t.string("gymui"),
    t.string("miuyg"),
    t.string("miugy"),
    t.string("miyug"),
    t.string("miygu"),
    t.string("miguy"),
    t.string("migyu"),
    t.string("mguiy"),
    t.string("mguyi"),
    t.string("mgyiu"),
    t.string("mgyui"),
    t.string("mgiyu"),
    t.string("mgiuy"),
    t.string("mugyi"),
    t.string("mugiy"),
    t.string("muygi"),
    t.string("muyig"),
    t.string("muigy"),
    t.string("muiyg"),
    t.string("mygiu"),
    t.string("mygui"),
    t.string("myuig"),
    t.string("myugi"),
    t.string("myiug"),
    t.string("myigu"),
    t.string("uigmy"),
    t.string("uigym"),
    t.string("uimgy"),
    t.string("uimyg"),
    t.string("uiygm"),
    t.string("uiymg"),
    t.string("ugiym"),
    t.string("ugimy"),
    t.string("ugmyi"),
    t.string("ugmiy"),
    t.string("ugymi"),
    t.string("ugyim"),
    t.string("umigy"),
    t.string("umiyg"),
    t.string("umgiy"),
    t.string("umgyi"),
    t.string("umyig"),
    t.string("umygi"),
    t.string("uyimg"),
    t.string("uyigm"),
    t.string("uygmi"),
    t.string("uygim"),
    t.string("uymgi"),
    t.string("uymig"),
    t.string("yiugm"),
    t.string("yiumg"),
    t.string("yigum"),
    t.string("yigmu"),
    t.string("yimug"),
    t.string("yimgu"),
    t.string("ygumi"),
    t.string("yguim"),
    t.string("ygimu"),
    t.string("ygium"),
    t.string("ygmiu"),
    t.string("ygmui"),
    t.string("ymuig"),
    t.string("ymugi"),
    t.string("ymiug"),
    t.string("ymigu"),
    t.string("ymgui"),
    t.string("ymgiu"),
    t.string("yumgi"),
    t.string("yumig"),
    t.string("yuigm"),
    t.string("yuimg"),
    t.string("yugim"),
    t.string("yugmi")
  )
);
t.declare(
  t.class(
    "RegExp",
    t.object(
      t.callProperty(
        t.function(
          t.param("pattern", t.union(t.string(), t.ref(RegExp))),
          t.param("flags", RegExp$flags, true),
          t.return(t.ref(RegExp))
        )
      ),
      t.property("compile", t.function(t.return(t.ref(RegExp)))),
      t.property(
        "constructor",
        t.function(
          t.param("pattern", t.union(t.string(), t.ref(RegExp))),
          t.param("flags", RegExp$flags, true),
          t.return(t.ref(RegExp))
        )
      ),
      t.property(
        "exec",
        t.function(t.param("string", t.string()), t.return(t.any()))
      ),
      t.property("flags", t.string()),
      t.property("global", t.boolean()),
      t.property("ignoreCase", t.boolean()),
      t.property("lastIndex", t.number()),
      t.property("multiline", t.boolean()),
      t.property("source", t.string()),
      t.property("sticky", t.boolean()),
      t.property("unicode", t.boolean()),
      t.property(
        "test",
        t.function(t.param("string", t.string()), t.return(t.boolean()))
      ),
      t.property("toString", t.function(t.return(t.string())))
    )
  )
);
t.declare(
  t.class(
    "String",
    t.object(
      t.callProperty(
        t.function(t.param("value", t.any()), t.return(t.string()))
      ),
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.string())))
      ),
      t.property(
        "anchor",
        t.function(t.param("name", t.string()), t.return(t.string()))
      ),
      t.property(
        "charAt",
        t.function(t.param("pos", t.number()), t.return(t.string()))
      ),
      t.property(
        "charCodeAt",
        t.function(t.param("index", t.number()), t.return(t.number()))
      ),
      t.property(
        "codePointAt",
        t.function(t.param("index", t.number()), t.return(t.number()))
      ),
      t.property(
        "concat",
        t.function(t.rest("strings", t.array(t.string())), t.return(t.string()))
      ),
      t.property(
        "endsWith",
        t.function(
          t.param("searchString", t.string()),
          t.param("position", t.number(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "includes",
        t.function(
          t.param("searchString", t.string()),
          t.param("position", t.number(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "indexOf",
        t.function(
          t.param("searchString", t.string()),
          t.param("position", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "lastIndexOf",
        t.function(
          t.param("searchString", t.string()),
          t.param("position", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "link",
        t.function(t.param("href", t.string()), t.return(t.string()))
      ),
      t.property(
        "localeCompare",
        t.function(t.param("that", t.string()), t.return(t.number()))
      ),
      t.property(
        "match",
        t.function(
          t.param("regexp", t.union(t.string(), t.ref(RegExp))),
          t.return(t.nullable(t.array(t.string())))
        )
      ),
      t.property(
        "normalize",
        t.function(t.param("format", t.string(), true), t.return(t.string()))
      ),
      t.property(
        "padEnd",
        t.function(
          t.param("targetLength", t.number()),
          t.param("padString", t.string(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "padStart",
        t.function(
          t.param("targetLength", t.number()),
          t.param("padString", t.string(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "repeat",
        t.function(t.param("count", t.number()), t.return(t.string()))
      ),
      t.property(
        "replace",
        t.function(
          t.param("searchValue", t.union(t.string(), t.ref(RegExp))),
          t.param(
            "replaceValue",
            t.union(
              t.string(),
              t.function(
                t.param("substring", t.string()),
                t.rest("args", t.array(t.any())),
                t.return(t.string())
              )
            )
          ),
          t.return(t.string())
        )
      ),
      t.property(
        "search",
        t.function(
          t.param("regexp", t.union(t.string(), t.ref(RegExp))),
          t.return(t.number())
        )
      ),
      t.property(
        "slice",
        t.function(
          t.param("start", t.number(), true),
          t.param("end", t.number(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "split",
        t.function(
          t.param("separator", t.union(t.string(), t.ref(RegExp)), true),
          t.param("limit", t.number(), true),
          t.return(t.array(t.string()))
        )
      ),
      t.property(
        "startsWith",
        t.function(
          t.param("searchString", t.string()),
          t.param("position", t.number(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "substr",
        t.function(
          t.param("from", t.number()),
          t.param("length", t.number(), true),
          t.return(t.string())
        )
      ),
      t.property(
        "substring",
        t.function(
          t.param("start", t.number()),
          t.param("end", t.number(), true),
          t.return(t.string())
        )
      ),
      t.property("toLocaleLowerCase", t.function(t.return(t.string()))),
      t.property("toLocaleUpperCase", t.function(t.return(t.string()))),
      t.property("toLowerCase", t.function(t.return(t.string()))),
      t.property("toUpperCase", t.function(t.return(t.string()))),
      t.property("trim", t.function(t.return(t.string()))),
      t.property("trimLeft", t.function(t.return(t.string()))),
      t.property("trimRight", t.function(t.return(t.string()))),
      t.property("valueOf", t.function(t.return(t.string()))),
      t.property("toString", t.function(t.return(t.string()))),
      t.property("length", t.number()),
      t.staticProperty(
        "fromCharCode",
        t.function(t.rest("codes", t.array(t.number())), t.return(t.string()))
      ),
      t.staticProperty(
        "fromCodePoint",
        t.function(t.rest("codes", t.array(t.number())), t.return(t.string()))
      ),
      t.staticProperty(
        "raw",
        t.function(t.param("templateString", t.string()), t.return(t.string()))
      ),
      t.staticProperty(
        "raw",
        t.function(
          t.param(
            "callSite",
            t.$shape(t.object(t.property("raw", t.string())))
          ),
          t.rest("substitutions", t.array(t.any())),
          t.return(t.string())
        )
      )
    )
  )
);
t.declare(
  t.class(
    "Object",
    t.object(
      t.callProperty(
        t.function(
          t.param("o", t.nullable(t.void())),
          t.return(t.object(t.indexer("key", t.any(), t.any())))
        )
      ),
      t.callProperty(
        t.function(t.param("o", t.boolean()), t.return(t.ref(Boolean)))
      ),
      t.callProperty(
        t.function(t.param("o", t.number()), t.return(t.ref(Number)))
      ),
      t.callProperty(
        t.function(t.param("o", t.string()), t.return(t.ref(String)))
      ),
      t.callProperty(
        t.function(_fn13 => {
          const T = _fn13.typeParameter("T", t.ref(Object));

          return [ t.param("o", T), t.return(T) ];
        })
      ),
      t.staticProperty("assign", t.ref("Object$Assign")),
      t.staticProperty(
        "create",
        t.function(
          t.param("o", t.any()),
          t.param("properties", t.any(), true),
          t.return(t.any())
        )
      ),
      t.staticProperty(
        "defineProperties",
        t.function(
          t.param("o", t.any()),
          t.param("properties", t.any()),
          t.return(t.any())
        )
      ),
      t.staticProperty(
        "defineProperty",
        t.function(
          t.param("o", t.any()),
          t.param("p", t.any()),
          t.param("attributes", t.any()),
          t.return(t.any())
        )
      ),
      t.staticProperty(
        "entries",
        t.function(
          t.param("object", t.any()),
          t.return(t.array(t.tuple(t.string(), t.mixed())))
        )
      ),
      t.staticProperty(
        "freeze",
        t.function(_fn14 => {
          const T = _fn14.typeParameter("T");

          return [ t.param("o", T), t.return(T) ];
        })
      ),
      t.staticProperty(
        "getOwnPropertyDescriptor",
        t.function(
          t.param("o", t.any()),
          t.param("p", t.any()),
          t.return(t.any())
        )
      ),
      t.staticProperty(
        "getOwnPropertyNames",
        t.function(t.param("o", t.any()), t.return(t.array(t.string())))
      ),
      t.staticProperty(
        "getOwnPropertySymbols",
        t.function(t.param("o", t.any()), t.return(t.array(t.ref(Symbol))))
      ),
      t.staticProperty("getPrototypeOf", t.ref("Object$GetPrototypeOf")),
      t.staticProperty(
        "is",
        t.function(
          t.param("a", t.any()),
          t.param("b", t.any()),
          t.return(t.boolean())
        )
      ),
      t.staticProperty(
        "isExtensible",
        t.function(t.param("o", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "isFrozen",
        t.function(t.param("o", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "isSealed",
        t.function(t.param("o", t.any()), t.return(t.boolean()))
      ),
      t.staticProperty(
        "keys",
        t.function(t.param("o", t.any()), t.return(t.array(t.string())))
      ),
      t.staticProperty(
        "preventExtensions",
        t.function(t.param("o", t.any()), t.return(t.any()))
      ),
      t.staticProperty(
        "seal",
        t.function(t.param("o", t.any()), t.return(t.any()))
      ),
      t.staticProperty(
        "setPrototypeOf",
        t.function(
          t.param("o", t.any()),
          t.param("proto", t.nullable(t.ref(Object))),
          t.return(t.boolean())
        )
      ),
      t.staticProperty(
        "values",
        t.function(t.param("object", t.any()), t.return(t.array(t.mixed())))
      ),
      t.property(
        "hasOwnProperty",
        t.function(t.param("prop", t.any()), t.return(t.boolean()))
      ),
      t.property(
        "isPrototypeOf",
        t.function(t.param("o", t.any()), t.return(t.boolean()))
      ),
      t.property(
        "propertyIsEnumerable",
        t.function(t.param("prop", t.any()), t.return(t.boolean()))
      ),
      t.property("toLocaleString", t.function(t.return(t.string()))),
      t.property("toString", t.function(t.return(t.string()))),
      t.property("valueOf", t.function(t.return(t.ref(Object)))),
      t.indexer("key", t.any(), t.any())
    )
  )
);
t.declare(
  "$await",
  t.function(_fn15 => {
    const T = _fn15.typeParameter("T");

    return [ t.param("p", t.union(t.ref(Promise, T), T)), t.return(T) ];
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
                    t.param("result", t.union(t.ref(Promise, R), R)),
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
                  t.return(t.union(t.ref(Promise, U), U))
                ),
                true
              ),
              t.param(
                "onReject",
                t.function(
                  t.param("error", t.any()),
                  t.return(t.union(t.ref(Promise, U), U))
                ),
                true
              ),
              t.return(t.ref(Promise, U))
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
                  t.return(t.union(t.nullable(t.ref(Promise, U)), U))
                ),
                true
              ),
              t.return(t.ref(Promise, U))
            ];
          })
        ),
        t.staticProperty(
          "resolve",
          t.function(_fn18 => {
            const T = _fn18.typeParameter("T");

            return [
              t.param("object", t.union(t.ref(Promise, T), T)),
              t.return(t.ref(Promise, T))
            ];
          })
        ),
        t.staticProperty(
          "reject",
          t.function(_fn19 => {
            const T = _fn19.typeParameter("T");

            return [
              t.param("error", t.any(), true),
              t.return(t.ref(Promise, T))
            ];
          })
        ),
        t.staticProperty(
          "all",
          t.function(_fn20 => {
            const Elem = _fn20.typeParameter("Elem"),
              T = _fn20.typeParameter("T", t.ref(Iterable, Elem));

            return [
              t.param("promises", T),
              t.return(t.ref(Promise, t.ref("$TupleMap", T, t.typeOf($await))))
            ];
          })
        ),
        t.staticProperty(
          "race",
          t.function(_fn21 => {
            const T = _fn21.typeParameter("T"),
              Elem = _fn21.typeParameter("Elem", t.union(t.ref(Promise, T), T));

            return [
              t.param("promises", t.array(Elem)),
              t.return(t.ref(Promise, T))
            ];
          })
        )
      )
    ];
  })
);

