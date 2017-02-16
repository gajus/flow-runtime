import t from "flow-runtime";
t.declare(t.type("$FlowIssue", t.$flowFixMe()));
t.declare(t.type("$FlowIgnore", t.$flowFixMe()));
t.declare(t.type("$FlowFixme", t.$flowFixMe()));
t.declare(t.type("$Fixme", t.$flowFixMe()));
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
      t.staticCallProperty(
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
          t.union(
            t.function(
              t.param("callbackfn", t.typeOf(Boolean)),
              t.return(t.array(t.ref("$NonMaybeType", T)))
            ),
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
          t.union(
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
            ),
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
          )
        ),
        t.property(
          "reduceRight",
          t.union(
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
            ),
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
          )
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
        t.staticCallProperty(
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
          t.union(
            t.function(
              t.param("callbackfn", t.typeOf(Boolean)),
              t.return(t.array(t.ref("$NonMaybeType", T)))
            ),
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
          t.union(
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
            ),
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
          )
        ),
        t.property(
          "reduceRight",
          t.union(
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
            ),
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
          )
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
          t.union(
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
            }),
            t.function(_fn9 => {
              const A = _fn9.typeParameter("A");

              return [
                t.param("iter", t.ref(Iterable, A)),
                t.param("mapFn", t.void()),
                t.return(t.array(A))
              ];
            }),
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
            }),
            t.function(_fn11 => {
              const A = _fn11.typeParameter("A");

              return [
                t.param("iter", t.ref(Iterator, A)),
                t.param("mapFn", t.void()),
                t.return(t.array(A))
              ];
            }),
            t.function(_fn12 => {
              const A = _fn12.typeParameter("A");

              return [
                t.param(
                  "arrayLike",
                  t.object(t.property("length", t.number()))
                ),
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
            }),
            t.function(
              t.param("arrayLike", t.object(t.property("length", t.number()))),
              t.param("mapFn", t.void()),
              t.return(t.array(t.void()))
            )
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
t.declare(t.class("$SymbolHasInstance", t.object()));
t.declare(t.class("$SymboIsConcatSpreadable", t.object()));
t.declare(t.class("$SymbolMatch", t.object()));
t.declare(t.class("$SymbolReplace", t.object()));
t.declare(t.class("$SymbolSearch", t.object()));
t.declare(t.class("$SymbolSpecies", t.object()));
t.declare(t.class("$SymbolSplit", t.object()));
t.declare(t.class("$SymbolToPrimitive", t.object()));
t.declare(t.class("$SymbolToStringTag", t.object()));
t.declare(t.class("$SymbolUnscopables", t.object()));
t.declare(
  t.class(
    "Symbol",
    t.object(
      t.staticCallProperty(
        t.function(t.param("value", t.any(), true), t.return(t.ref("Symbol")))
      ),
      t.staticProperty(
        "for",
        t.function(t.param("key", t.string()), t.return(t.ref("Symbol")))
      ),
      t.staticProperty("hasInstance", t.ref("$SymbolHasInstance")),
      t.staticProperty("isConcatSpreadable", t.ref("$SymboIsConcatSpreadable")),
      t.staticProperty("iterator", t.string()),
      t.staticProperty(
        "keyFor",
        t.function(
          t.param("sym", t.ref("Symbol")),
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
      t.property("valueOf", t.function(t.return(t.nullable(t.ref("Symbol")))))
    )
  )
);
t.declare(
  t.class(
    "Number",
    t.object(
      t.staticCallProperty(
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
      t.staticCallProperty(
        t.function(
          t.param("pattern", t.union(t.string(), t.ref("RegExp"))),
          t.param("flags", RegExp$flags, true),
          t.return(t.ref("RegExp"))
        )
      ),
      t.property("compile", t.function(t.return(t.ref("RegExp")))),
      t.property(
        "constructor",
        t.function(
          t.param("pattern", t.union(t.string(), t.ref("RegExp"))),
          t.param("flags", RegExp$flags, true),
          t.return(t.ref("RegExp"))
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
      t.staticCallProperty(
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
          t.param("regexp", t.union(t.string(), t.ref("RegExp"))),
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
          t.param("searchValue", t.union(t.string(), t.ref("RegExp"))),
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
          t.param("regexp", t.union(t.string(), t.ref("RegExp"))),
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
          t.param("separator", t.union(t.string(), t.ref("RegExp")), true),
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
        t.union(
          t.function(
            t.param("templateString", t.string()),
            t.return(t.string())
          ),
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
  )
);
t.declare(
  t.class(
    "Object",
    t.object(
      t.staticCallProperty(
        t.function(
          t.param("o", t.nullable(t.void())),
          t.return(t.object(t.indexer("key", t.any(), t.any())))
        )
      ),
      t.staticCallProperty(
        t.function(t.param("o", t.boolean()), t.return(t.ref("Boolean")))
      ),
      t.staticCallProperty(
        t.function(t.param("o", t.number()), t.return(t.ref("Number")))
      ),
      t.staticCallProperty(
        t.function(t.param("o", t.string()), t.return(t.ref("String")))
      ),
      t.staticCallProperty(
        t.function(_fn13 => {
          const T = _fn13.typeParameter("T", t.object());

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
        t.function(t.param("o", t.any()), t.return(t.array(t.ref("Symbol"))))
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
          t.param("proto", t.nullable(t.object())),
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
      t.property("valueOf", t.function(t.return(t.object()))),
      t.indexer("key", t.any(), t.any())
    )
  )
);
t.declare(
  t.class(
    "Function",
    t.object(
      t.property("apply", t.ref("Function$Prototype$Apply")),
      t.property("bind", t.ref("Function$Prototype$Bind")),
      t.property("call", t.ref("Function$Prototype$Call")),
      t.property("arguments", t.any()),
      t.property("caller", t.union(t.function(), t.null())),
      t.property("length", t.number()),
      t.property("name", t.string())
    )
  )
);
t.declare(
  t.class(
    "CallSite",
    t.object(
      t.property("getThis", t.function(t.return(t.any()))),
      t.property("getTypeName", t.function(t.return(t.string()))),
      t.property("getFunction", t.function(t.return(t.nullable(t.function())))),
      t.property("getFunctionName", t.function(t.return(t.string()))),
      t.property("getMethodName", t.function(t.return(t.string()))),
      t.property("getFileName", t.function(t.return(t.nullable(t.string())))),
      t.property("getLineNumber", t.function(t.return(t.nullable(t.number())))),
      t.property(
        "getColumnNumber",
        t.function(t.return(t.nullable(t.number())))
      ),
      t.property(
        "getEvalOrigin",
        t.function(t.return(t.nullable(t.ref("CallSite"))))
      ),
      t.property(
        "getScriptNameOrSourceURL",
        t.function(t.return(t.nullable(t.string())))
      ),
      t.property("isToplevel", t.function(t.return(t.boolean()))),
      t.property("isEval", t.function(t.return(t.boolean()))),
      t.property("isNative", t.function(t.return(t.boolean()))),
      t.property("isConstructor", t.function(t.return(t.boolean()))),
      t.property("toString", t.function(t.return(t.string())))
    )
  )
);
t.declare(
  t.class(
    "Error",
    t.object(
      t.staticCallProperty(
        t.function(
          t.param("message", t.string(), true),
          t.return(t.ref("Error"))
        )
      ),
      t.property("name", t.string()),
      t.property("message", t.string()),
      t.property("stack", t.string()),
      t.property("toString", t.function(t.return(t.string()))),
      t.property("description", t.string(), true),
      t.property("number", t.number(), true),
      t.property("fileName", t.string(), true),
      t.property("lineNumber", t.number(), true),
      t.property("columnNumber", t.number(), true),
      t.staticProperty(
        "captureStackTrace",
        t.function(
          t.param("target", t.object()),
          t.param("constructor", t.function(), true),
          t.return(t.void())
        ),
        true
      ),
      t.staticProperty("stackTraceLimit", t.number(), true),
      t.staticProperty(
        "prepareStackTrace",
        t.function(
          t.param("err", t.ref("Error")),
          t.param("stack", t.array(t.ref("CallSite"))),
          t.return(t.mixed())
        ),
        true
      )
    )
  )
);
const Event$Init = t.type(
  "Event$Init",
  t.object(
    t.property("bubbles", t.boolean(), true),
    t.property("cancelable", t.boolean(), true),
    t.property("composed", t.boolean(), true),
    t.property("scoped", t.nullable(t.boolean()), true)
  )
);
const MouseEventTypes = t.type(
  "MouseEventTypes",
  t.union(
    t.string("contextmenu"),
    t.string("mousedown"),
    t.string("mouseenter"),
    t.string("mouseleave"),
    t.string("mousemove"),
    t.string("mouseout"),
    t.string("mouseover"),
    t.string("mouseup"),
    t.string("click"),
    t.string("dblclick")
  )
);
t.declare(
  t.class(
    "UIEvent",
    t.object(t.property("detail", t.number()), t.property("view", t.any())),
    t.extends("Event")
  )
);
t.declare(
  t.class(
    "MouseEvent",
    t.object(
      t.property("altKey", t.boolean()),
      t.property("button", t.number()),
      t.property("buttons", t.number()),
      t.property("clientX", t.number()),
      t.property("clientY", t.number()),
      t.property("ctrlKey", t.boolean()),
      t.property("metaKey", t.boolean()),
      t.property("movementX", t.number()),
      t.property("movementY", t.number()),
      t.property("offsetX", t.number()),
      t.property("offsetY", t.number()),
      t.property("pageX", t.number()),
      t.property("pageY", t.number()),
      t.property("region", t.nullable(t.string())),
      t.property("screenX", t.number()),
      t.property("screenY", t.number()),
      t.property("shiftKey", t.boolean()),
      t.property("relatedTarget", t.nullable(t.ref("EventTarget"))),
      t.property(
        "getModifierState",
        t.function(t.param("keyArg", t.string()), t.return(t.boolean()))
      )
    ),
    t.extends("UIEvent")
  )
);
const MouseEventHandler = t.type(
  "MouseEventHandler",
  t.function(t.param("event", t.ref("MouseEvent")), t.return(t.mixed()))
);
const MouseEventListener = t.type(
  "MouseEventListener",
  t.union(
    t.object(t.property("handleEvent", MouseEventHandler)),
    MouseEventHandler
  )
);
const EventListenerOptionsOrUseCapture = t.type(
  "EventListenerOptionsOrUseCapture",
  t.union(
    t.boolean(),
    t.object(
      t.property("capture", t.boolean(), true),
      t.property("once", t.boolean(), true),
      t.property("passive", t.boolean(), true)
    )
  )
);
const KeyboardEventTypes = t.type(
  "KeyboardEventTypes",
  t.union(t.string("keydown"), t.string("keyup"), t.string("keypress"))
);
t.declare(
  t.class(
    "KeyboardEvent",
    t.object(
      t.property("altKey", t.boolean()),
      t.property("code", t.string()),
      t.property("ctrlKey", t.boolean()),
      t.property("isComposing", t.boolean()),
      t.property("key", t.string()),
      t.property("location", t.number()),
      t.property("metaKey", t.boolean()),
      t.property("repeat", t.boolean()),
      t.property("shiftKey", t.boolean()),
      t.property(
        "getModifierState",
        t.function(t.param("keyArg", t.string(), true), t.return(t.boolean()))
      ),
      t.property("charCode", t.number()),
      t.property("keyCode", t.number()),
      t.property("which", t.number())
    ),
    t.extends("UIEvent")
  )
);
const KeyboardEventHandler = t.type(
  "KeyboardEventHandler",
  t.function(t.param("event", t.ref("KeyboardEvent")), t.return(t.mixed()))
);
const KeyboardEventListener = t.type(
  "KeyboardEventListener",
  t.union(
    t.object(t.property("handleEvent", KeyboardEventHandler)),
    KeyboardEventHandler
  )
);
const TouchEventTypes = t.type(
  "TouchEventTypes",
  t.union(
    t.string("touchstart"),
    t.string("touchmove"),
    t.string("touchend"),
    t.string("touchcancel")
  )
);
t.declare(
  t.class(
    "Touch",
    t.object(
      t.property("clientX", t.number()),
      t.property("clientY", t.number()),
      t.property("identifier", t.number()),
      t.property("pageX", t.number()),
      t.property("pageY", t.number()),
      t.property("screenX", t.number()),
      t.property("screenY", t.number()),
      t.property("target", t.ref("EventTarget"))
    )
  )
);
t.declare(
  t.class(
    "TouchList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("Touch"))))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(
          t.param("index", t.number()),
          t.return(t.union(t.null(), t.ref("Touch")))
        )
      ),
      t.indexer("index", t.number(), t.ref("Touch"))
    )
  )
);
t.declare(
  t.class(
    "TouchEvent",
    t.object(
      t.property("altKey", t.boolean()),
      t.property("changedTouches", t.ref("TouchList")),
      t.property("ctrlKey", t.boolean()),
      t.property("metaKey", t.boolean()),
      t.property("shiftKey", t.boolean()),
      t.property("targetTouchesRead", t.ref("TouchList")),
      t.property("touches", t.ref("TouchList"))
    ),
    t.extends("UIEvent")
  )
);
const TouchEventHandler = t.type(
  "TouchEventHandler",
  t.function(t.param("event", t.ref("TouchEvent")), t.return(t.mixed()))
);
const TouchEventListener = t.type(
  "TouchEventListener",
  t.union(
    t.object(t.property("handleEvent", TouchEventHandler)),
    TouchEventHandler
  )
);
const WheelEventTypes = t.type("WheelEventTypes", t.string("wheel"));
t.declare(
  t.class(
    "WheelEvent",
    t.object(
      t.property("deltaX", t.number()),
      t.property("deltaY", t.number()),
      t.property("deltaZ", t.number()),
      t.property("deltaMode", t.union(t.number(0), t.number(1), t.number(2)))
    ),
    t.extends("MouseEvent")
  )
);
const WheelEventHandler = t.type(
  "WheelEventHandler",
  t.function(t.param("event", t.ref("WheelEvent")), t.return(t.mixed()))
);
const WheelEventListener = t.type(
  "WheelEventListener",
  t.union(
    t.object(t.property("handleEvent", WheelEventHandler)),
    WheelEventHandler
  )
);
const ProgressEventTypes = t.type(
  "ProgressEventTypes",
  t.union(
    t.string("abort"),
    t.string("error"),
    t.string("load"),
    t.string("loadend"),
    t.string("loadstart"),
    t.string("progress"),
    t.string("timeout")
  )
);
t.declare(
  t.class(
    "ProgressEvent",
    t.object(
      t.property("lengthComputable", t.boolean()),
      t.property("loaded", t.number()),
      t.property("total", t.number()),
      t.property(
        "initProgressEvent",
        t.function(
          t.param("typeArg", t.string()),
          t.param("canBubbleArg", t.boolean()),
          t.param("cancelableArg", t.boolean()),
          t.param("lengthComputableArg", t.boolean()),
          t.param("loadedArg", t.number()),
          t.param("totalArg", t.number()),
          t.return(t.void())
        )
      )
    ),
    t.extends("Event")
  )
);
const ProgressEventHandler = t.type(
  "ProgressEventHandler",
  t.function(t.param("event", t.ref("ProgressEvent")), t.return(t.mixed()))
);
const ProgressEventListener = t.type(
  "ProgressEventListener",
  t.union(
    t.object(t.property("handleEvent", ProgressEventHandler)),
    ProgressEventHandler
  )
);
const DragEventTypes = t.type(
  "DragEventTypes",
  t.union(
    t.string("drag"),
    t.string("dragend"),
    t.string("dragenter"),
    t.string("dragexit"),
    t.string("dragleave"),
    t.string("dragover"),
    t.string("dragstart"),
    t.string("drop")
  )
);
t.declare(
  t.class("NodeList", _NodeList => {
    const T = _NodeList.typeParameter("T");

    return [
      t.object(
        t.property("____iterator", t.function(t.return(t.ref(Iterator, T)))),
        t.property("length", t.number()),
        t.property(
          "item",
          t.function(t.param("index", t.number()), t.return(T))
        ),
        t.property(
          "forEach",
          t.function(
            t.param(
              "callbackfn",
              t.function(
                t.param("value", T),
                t.param("index", t.number()),
                t.param("list", t.ref("NodeList", T)),
                t.return(t.any())
              )
            ),
            t.param("thisArg", t.any(), true),
            t.return(t.void())
          )
        ),
        t.property(
          "entries",
          t.function(t.return(t.ref(Iterator, t.tuple(t.number(), T))))
        ),
        t.property("keys", t.function(t.return(t.ref(Iterator, t.number())))),
        t.property("values", t.function(t.return(t.ref(Iterator, T)))),
        t.indexer("index", t.number(), T)
      )
    ];
  })
);
t.declare(
  t.class(
    "ClientRect",
    t.object(
      t.property("left", t.number()),
      t.property("width", t.number()),
      t.property("right", t.number()),
      t.property("top", t.number()),
      t.property("bottom", t.number()),
      t.property("height", t.number())
    )
  )
);
t.declare(
  t.class(
    "HTMLMenuElement",
    t.object(
      t.property("getCompact", t.function(t.return(t.boolean()))),
      t.property(
        "setCompact",
        t.function(t.param("compact", t.boolean()), t.return(t.void()))
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "MediaList",
    t.object(
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.string())))
      ),
      t.property("mediaText", t.string()),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(
          t.param("index", t.number()),
          t.return(t.nullable(t.string()))
        )
      ),
      t.property(
        "deleteMedium",
        t.function(t.param("oldMedium", t.string()), t.return(t.void()))
      ),
      t.property(
        "appendMedium",
        t.function(t.param("newMedium", t.string()), t.return(t.void()))
      ),
      t.indexer("index", t.number(), t.string())
    )
  )
);
t.declare(
  t.class(
    "StyleSheet",
    t.object(
      t.property("disabled", t.boolean()),
      t.property("href", t.string()),
      t.property("media", t.ref("MediaList")),
      t.property("ownerNode", t.ref("Node")),
      t.property("parentStyleSheet", t.nullable(t.ref("StyleSheet"))),
      t.property("title", t.string()),
      t.property("type", t.string())
    )
  )
);
t.declare(
  t.class(
    "CSSRuleList",
    t.object(
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.ref("CSSRule"))))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(
          t.param("index", t.number()),
          t.return(t.nullable(t.ref("CSSRule")))
        )
      ),
      t.indexer("index", t.number(), t.ref("CSSRule"))
    )
  )
);
t.declare(
  t.class(
    "CSSStyleSheet",
    t.object(
      t.property("cssRules", t.ref("CSSRuleList")),
      t.property("ownerRule", t.nullable(t.ref("CSSRule"))),
      t.property(
        "deleteRule",
        t.function(t.param("index", t.number()), t.return(t.void()))
      ),
      t.property(
        "insertRule",
        t.function(
          t.param("rule", t.string()),
          t.param("index", t.number()),
          t.return(t.void())
        )
      )
    ),
    t.extends("StyleSheet")
  )
);
t.declare(
  t.class(
    "CSSRule",
    t.object(
      t.property("cssText", t.string()),
      t.property("parentRule", t.nullable(t.ref("CSSRule"))),
      t.property("parentStyleSheet", t.nullable(t.ref("CSSStyleSheet"))),
      t.property("type", t.number()),
      t.staticProperty("STYLE_RULE", t.number()),
      t.staticProperty("MEDIA_RULE", t.number()),
      t.staticProperty("FONT_FACE_RULE", t.number()),
      t.staticProperty("PAGE_RULE", t.number()),
      t.staticProperty("IMPORT_RULE", t.number()),
      t.staticProperty("CHARSET_RULE", t.number()),
      t.staticProperty("UNKNOWN_RULE", t.number()),
      t.staticProperty("KEYFRAMES_RULE", t.number()),
      t.staticProperty("KEYFRAME_RULE", t.number()),
      t.staticProperty("NAMESPACE_RULE", t.number()),
      t.staticProperty("COUNTER_STYLE_RULE", t.number()),
      t.staticProperty("SUPPORTS_RULE", t.number()),
      t.staticProperty("DOCUMENT_RULE", t.number()),
      t.staticProperty("FONT_FEATURE_VALUES_RULE", t.number()),
      t.staticProperty("VIEWPORT_RULE", t.number()),
      t.staticProperty("REGION_STYLE_RULE", t.number())
    )
  )
);
t.declare(
  t.class(
    "CSSStyleDeclaration",
    t.object(
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.string())))
      ),
      t.property("alignContent", t.string()),
      t.property("alignItems", t.string()),
      t.property("alignSelf", t.string()),
      t.property("all", t.string()),
      t.property("animation", t.string()),
      t.property("animationDelay", t.string()),
      t.property("animationDirection", t.string()),
      t.property("animationDuration", t.string()),
      t.property("animationFillMode", t.string()),
      t.property("animationIterationCount", t.string()),
      t.property("animationName", t.string()),
      t.property("animationPlayState", t.string()),
      t.property("animationTimingFunction", t.string()),
      t.property("backdropFilter", t.string()),
      t.property("webkitBackdropFilter", t.string()),
      t.property("backfaceVisibility", t.string()),
      t.property("background", t.string()),
      t.property("backgroundAttachment", t.string()),
      t.property("backgroundBlendMode", t.string()),
      t.property("backgroundClip", t.string()),
      t.property("backgroundColor", t.string()),
      t.property("backgroundImage", t.string()),
      t.property("backgroundOrigin", t.string()),
      t.property("backgroundPosition", t.string()),
      t.property("backgroundRepeat", t.string()),
      t.property("backgroundSize", t.string()),
      t.property("blockSize", t.string()),
      t.property("border", t.string()),
      t.property("borderBlockEnd", t.string()),
      t.property("borderBlockEndColor", t.string()),
      t.property("borderBlockEndStyle", t.string()),
      t.property("borderBlockEndWidth", t.string()),
      t.property("borderBlockStart", t.string()),
      t.property("borderBlockStartColor", t.string()),
      t.property("borderBlockStartStyle", t.string()),
      t.property("borderBlockStartWidth", t.string()),
      t.property("borderBottom", t.string()),
      t.property("borderBottomColor", t.string()),
      t.property("borderBottomLeftRadius", t.string()),
      t.property("borderBottomRightRadius", t.string()),
      t.property("borderBottomStyle", t.string()),
      t.property("borderBottomWidth", t.string()),
      t.property("borderCollapse", t.string()),
      t.property("borderColor", t.string()),
      t.property("borderImage", t.string()),
      t.property("borderImageOutset", t.string()),
      t.property("borderImageRepeat", t.string()),
      t.property("borderImageSlice", t.string()),
      t.property("borderImageSource", t.string()),
      t.property("borderImageWidth", t.string()),
      t.property("borderInlineEnd", t.string()),
      t.property("borderInlineEndColor", t.string()),
      t.property("borderInlineEndStyle", t.string()),
      t.property("borderInlineEndWidth", t.string()),
      t.property("borderInlineStart", t.string()),
      t.property("borderInlineStartColor", t.string()),
      t.property("borderInlineStartStyle", t.string()),
      t.property("borderInlineStartWidth", t.string()),
      t.property("borderLeft", t.string()),
      t.property("borderLeftColor", t.string()),
      t.property("borderLeftStyle", t.string()),
      t.property("borderLeftWidth", t.string()),
      t.property("borderRadius", t.string()),
      t.property("borderRight", t.string()),
      t.property("borderRightColor", t.string()),
      t.property("borderRightStyle", t.string()),
      t.property("borderRightWidth", t.string()),
      t.property("borderSpacing", t.string()),
      t.property("borderStyle", t.string()),
      t.property("borderTop", t.string()),
      t.property("borderTopColor", t.string()),
      t.property("borderTopLeftRadius", t.string()),
      t.property("borderTopRightRadius", t.string()),
      t.property("borderTopStyle", t.string()),
      t.property("borderTopWidth", t.string()),
      t.property("borderWidth", t.string()),
      t.property("bottom", t.string()),
      t.property("boxDecorationBreak", t.string()),
      t.property("boxShadow", t.string()),
      t.property("boxSizing", t.string()),
      t.property("breakAfter", t.string()),
      t.property("breakBefore", t.string()),
      t.property("breakInside", t.string()),
      t.property("captionSide", t.string()),
      t.property("clear", t.string()),
      t.property("clip", t.string()),
      t.property("clipPath", t.string()),
      t.property("color", t.string()),
      t.property("columns", t.string()),
      t.property("columnCount", t.string()),
      t.property("columnFill", t.string()),
      t.property("columnGap", t.string()),
      t.property("columnRule", t.string()),
      t.property("columnRuleColor", t.string()),
      t.property("columnRuleStyle", t.string()),
      t.property("columnRuleWidth", t.string()),
      t.property("columnSpan", t.string()),
      t.property("columnWidth", t.string()),
      t.property("contain", t.string()),
      t.property("content", t.string()),
      t.property("counterIncrement", t.string()),
      t.property("counterReset", t.string()),
      t.property("cursor", t.string()),
      t.property("direction", t.string()),
      t.property("display", t.string()),
      t.property("emptyCells", t.string()),
      t.property("filter", t.string()),
      t.property("flex", t.string()),
      t.property("flexBasis", t.string()),
      t.property("flexDirection", t.string()),
      t.property("flexFlow", t.string()),
      t.property("flexGrow", t.string()),
      t.property("flexShrink", t.string()),
      t.property("flexWrap", t.string()),
      t.property("float", t.string()),
      t.property("font", t.string()),
      t.property("fontFamily", t.string()),
      t.property("fontFeatureSettings", t.string()),
      t.property("fontKerning", t.string()),
      t.property("fontLanguageOverride", t.string()),
      t.property("fontSize", t.string()),
      t.property("fontSizeAdjust", t.string()),
      t.property("fontStretch", t.string()),
      t.property("fontStyle", t.string()),
      t.property("fontSynthesis", t.string()),
      t.property("fontVariant", t.string()),
      t.property("fontVariantAlternates", t.string()),
      t.property("fontVariantCaps", t.string()),
      t.property("fontVariantEastAsian", t.string()),
      t.property("fontVariantLigatures", t.string()),
      t.property("fontVariantNumeric", t.string()),
      t.property("fontVariantPosition", t.string()),
      t.property("fontWeight", t.string()),
      t.property("grad", t.string()),
      t.property("grid", t.string()),
      t.property("gridArea", t.string()),
      t.property("gridAutoColumns", t.string()),
      t.property("gridAutoFlow", t.string()),
      t.property("gridAutoPosition", t.string()),
      t.property("gridAutoRows", t.string()),
      t.property("gridColumn", t.string()),
      t.property("gridColumnStart", t.string()),
      t.property("gridColumnEnd", t.string()),
      t.property("gridRow", t.string()),
      t.property("gridRowStart", t.string()),
      t.property("gridRowEnd", t.string()),
      t.property("gridTemplate", t.string()),
      t.property("gridTemplateAreas", t.string()),
      t.property("gridTemplateRows", t.string()),
      t.property("gridTemplateColumns", t.string()),
      t.property("height", t.string()),
      t.property("hyphens", t.string()),
      t.property("imageRendering", t.string()),
      t.property("imageResolution", t.string()),
      t.property("imageOrientation", t.string()),
      t.property("imeMode", t.string()),
      t.property("inherit", t.string()),
      t.property("initial", t.string()),
      t.property("inlineSize", t.string()),
      t.property("isolation", t.string()),
      t.property("justifyContent", t.string()),
      t.property("left", t.string()),
      t.property("letterSpacing", t.string()),
      t.property("lineBreak", t.string()),
      t.property("lineHeight", t.string()),
      t.property("listStyle", t.string()),
      t.property("listStyleImage", t.string()),
      t.property("listStylePosition", t.string()),
      t.property("listStyleType", t.string()),
      t.property("margin", t.string()),
      t.property("marginBlockEnd", t.string()),
      t.property("marginBlockStart", t.string()),
      t.property("marginBottom", t.string()),
      t.property("marginInlineEnd", t.string()),
      t.property("marginInlineStart", t.string()),
      t.property("marginLeft", t.string()),
      t.property("marginRight", t.string()),
      t.property("marginTop", t.string()),
      t.property("marks", t.string()),
      t.property("mask", t.string()),
      t.property("maskType", t.string()),
      t.property("maxBlockSize", t.string()),
      t.property("maxHeight", t.string()),
      t.property("maxInlineSize", t.string()),
      t.property("maxWidth", t.string()),
      t.property("minBlockSize", t.string()),
      t.property("minHeight", t.string()),
      t.property("minInlineSize", t.string()),
      t.property("minWidth", t.string()),
      t.property("mixBlendMode", t.string()),
      t.property("mozTransform", t.string()),
      t.property("mozTransformOrigin", t.string()),
      t.property("mozTransitionDelay", t.string()),
      t.property("mozTransitionDuration", t.string()),
      t.property("mozTransitionProperty", t.string()),
      t.property("mozTransitionTimingFunction", t.string()),
      t.property("objectFit", t.string()),
      t.property("objectPosition", t.string()),
      t.property("offsetBlockEnd", t.string()),
      t.property("offsetBlockStart", t.string()),
      t.property("offsetInlineEnd", t.string()),
      t.property("offsetInlineStart", t.string()),
      t.property("opacity", t.string()),
      t.property("order", t.string()),
      t.property("orphans", t.string()),
      t.property("outline", t.string()),
      t.property("outlineColor", t.string()),
      t.property("outlineOffset", t.string()),
      t.property("outlineStyle", t.string()),
      t.property("outlineWidth", t.string()),
      t.property("overflow", t.string()),
      t.property("overflowWrap", t.string()),
      t.property("overflowX", t.string()),
      t.property("overflowY", t.string()),
      t.property("padding", t.string()),
      t.property("paddingBlockEnd", t.string()),
      t.property("paddingBlockStart", t.string()),
      t.property("paddingBottom", t.string()),
      t.property("paddingInlineEnd", t.string()),
      t.property("paddingInlineStart", t.string()),
      t.property("paddingLeft", t.string()),
      t.property("paddingRight", t.string()),
      t.property("paddingTop", t.string()),
      t.property("pageBreakAfter", t.string()),
      t.property("pageBreakBefore", t.string()),
      t.property("pageBreakInside", t.string()),
      t.property("perspective", t.string()),
      t.property("perspectiveOrigin", t.string()),
      t.property("pointerEvents", t.string()),
      t.property("position", t.string()),
      t.property("quotes", t.string()),
      t.property("rad", t.string()),
      t.property("resize", t.string()),
      t.property("right", t.string()),
      t.property("rubyAlign", t.string()),
      t.property("rubyMerge", t.string()),
      t.property("rubyPosition", t.string()),
      t.property("scrollBehavior", t.string()),
      t.property("scrollSnapCoordinate", t.string()),
      t.property("scrollSnapDestination", t.string()),
      t.property("scrollSnapPointsX", t.string()),
      t.property("scrollSnapPointsY", t.string()),
      t.property("scrollSnapType", t.string()),
      t.property("shapeImageThreshold", t.string()),
      t.property("shapeMargin", t.string()),
      t.property("shapeOutside", t.string()),
      t.property("tableLayout", t.string()),
      t.property("tabSize", t.string()),
      t.property("textAlign", t.string()),
      t.property("textAlignLast", t.string()),
      t.property("textCombineUpright", t.string()),
      t.property("textDecoration", t.string()),
      t.property("textDecorationColor", t.string()),
      t.property("textDecorationLine", t.string()),
      t.property("textDecorationStyle", t.string()),
      t.property("textIndent", t.string()),
      t.property("textOrientation", t.string()),
      t.property("textOverflow", t.string()),
      t.property("textRendering", t.string()),
      t.property("textShadow", t.string()),
      t.property("textTransform", t.string()),
      t.property("textUnderlinePosition", t.string()),
      t.property("top", t.string()),
      t.property("touchAction", t.string()),
      t.property("transform", t.string()),
      t.property("transformOrigin", t.string()),
      t.property("transformStyle", t.string()),
      t.property("transition", t.string()),
      t.property("transitionDelay", t.string()),
      t.property("transitionDuration", t.string()),
      t.property("transitionProperty", t.string()),
      t.property("transitionTimingFunction", t.string()),
      t.property("turn", t.string()),
      t.property("unicodeBidi", t.string()),
      t.property("unicodeRange", t.string()),
      t.property("verticalAlign", t.string()),
      t.property("visibility", t.string()),
      t.property("webkitOverflowScrolling", t.string()),
      t.property("webkitTransform", t.string()),
      t.property("webkitTransformOrigin", t.string()),
      t.property("webkitTransitionDelay", t.string()),
      t.property("webkitTransitionDuration", t.string()),
      t.property("webkitTransitionProperty", t.string()),
      t.property("webkitTransitionTimingFunction", t.string()),
      t.property("whiteSpace", t.string()),
      t.property("widows", t.string()),
      t.property("width", t.string()),
      t.property("willChange", t.string()),
      t.property("wordBreak", t.string()),
      t.property("wordSpacing", t.string()),
      t.property("wordWrap", t.string()),
      t.property("writingMode", t.string()),
      t.property("zIndex", t.string()),
      t.property("cssFloat", t.string()),
      t.property("cssText", t.string()),
      t.property(
        "getPropertyPriority",
        t.function(t.param("property", t.string()), t.return(t.string()))
      ),
      t.property(
        "getPropertyValue",
        t.function(t.param("property", t.string()), t.return(t.string()))
      ),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.string()))
      ),
      t.property("length", t.number()),
      t.property("parentRule", t.ref("CSSRule")),
      t.property(
        "removeProperty",
        t.function(t.param("property", t.string()), t.return(t.string()))
      ),
      t.property(
        "setProperty",
        t.function(
          t.param("property", t.string()),
          t.param("value", t.nullable(t.string())),
          t.param("priority", t.nullable(t.string())),
          t.return(t.void())
        )
      ),
      t.property(
        "setPropertyPriority",
        t.function(
          t.param("property", t.string()),
          t.param("priority", t.string()),
          t.return(t.void())
        )
      ),
      t.indexer("index", t.number(), t.string())
    )
  )
);
t.declare(
  t.class(
    "HTMLElement",
    t.object(
      t.property("blur", t.function(t.return(t.void()))),
      t.property("click", t.function(t.return(t.void()))),
      t.property("focus", t.function(t.return(t.void()))),
      t.property(
        "getBoundingClientRect",
        t.function(t.return(t.ref("ClientRect")))
      ),
      t.property("forceSpellcheck", t.function(t.return(t.void()))),
      t.property("accessKey", t.string()),
      t.property("accessKeyLabel", t.string()),
      t.property("className", t.string()),
      t.property("contentEditable", t.string()),
      t.property("contextMenu", t.nullable(t.ref("HTMLMenuElement"))),
      t.property("dataset", t.object(t.indexer("key", t.string(), t.string()))),
      t.property(
        "dir",
        t.union(t.string("ltr"), t.string("trl"), t.string("auto"))
      ),
      t.property("draggable", t.boolean()),
      t.property("dropzone", t.any()),
      t.property("hidden", t.boolean()),
      t.property("id", t.string()),
      t.property("innerHTML", t.string()),
      t.property("isContentEditable", t.boolean()),
      t.property("itemProp", t.any()),
      t.property("itemScope", t.boolean()),
      t.property("itemType", t.any()),
      t.property("itemValue", t.object()),
      t.property("lang", t.string()),
      t.property("offsetHeight", t.number()),
      t.property("offsetLeft", t.number()),
      t.property("offsetParent", t.ref("Element")),
      t.property("offsetTop", t.number()),
      t.property("offsetWidth", t.number()),
      t.property("onabort", t.nullable(t.function())),
      t.property("onblur", t.nullable(t.function())),
      t.property("oncancel", t.nullable(t.function())),
      t.property("oncanplay", t.nullable(t.function())),
      t.property("oncanplaythrough", t.nullable(t.function())),
      t.property("onchange", t.nullable(t.function())),
      t.property("onclick", t.nullable(t.function())),
      t.property("oncuechange", t.nullable(t.function())),
      t.property("ondblclick", t.nullable(t.function())),
      t.property("ondurationchange", t.nullable(t.function())),
      t.property("onemptied", t.nullable(t.function())),
      t.property("onended", t.nullable(t.function())),
      t.property("onerror", t.nullable(t.function())),
      t.property("onfocus", t.nullable(t.function())),
      t.property("oninput", t.nullable(t.function())),
      t.property("oninvalid", t.nullable(t.function())),
      t.property("onkeydown", t.nullable(t.function())),
      t.property("onkeypress", t.nullable(t.function())),
      t.property("onkeyup", t.nullable(t.function())),
      t.property("onload", t.nullable(t.function())),
      t.property("onloadeddata", t.nullable(t.function())),
      t.property("onloadedmetadata", t.nullable(t.function())),
      t.property("onloadstart", t.nullable(t.function())),
      t.property("onmousedown", t.nullable(t.function())),
      t.property("onmouseenter", t.nullable(t.function())),
      t.property("onmouseleave", t.nullable(t.function())),
      t.property("onmousemove", t.nullable(t.function())),
      t.property("onmouseout", t.nullable(t.function())),
      t.property("onmouseover", t.nullable(t.function())),
      t.property("onmouseup", t.nullable(t.function())),
      t.property("onmousewheel", t.nullable(t.function())),
      t.property("onpause", t.nullable(t.function())),
      t.property("onplay", t.nullable(t.function())),
      t.property("onplaying", t.nullable(t.function())),
      t.property("onprogress", t.nullable(t.function())),
      t.property("onratechange", t.nullable(t.function())),
      t.property("onreadystatechange", t.nullable(t.function())),
      t.property("onreset", t.nullable(t.function())),
      t.property("onresize", t.nullable(t.function())),
      t.property("onscroll", t.nullable(t.function())),
      t.property("onseeked", t.nullable(t.function())),
      t.property("onseeking", t.nullable(t.function())),
      t.property("onselect", t.nullable(t.function())),
      t.property("onshow", t.nullable(t.function())),
      t.property("onstalled", t.nullable(t.function())),
      t.property("onsubmit", t.nullable(t.function())),
      t.property("onsuspend", t.nullable(t.function())),
      t.property("ontimeupdate", t.nullable(t.function())),
      t.property("ontoggle", t.nullable(t.function())),
      t.property("onvolumechange", t.nullable(t.function())),
      t.property("onwaiting", t.nullable(t.function())),
      t.property("properties", t.any()),
      t.property("spellcheck", t.boolean()),
      t.property("style", t.ref("CSSStyleDeclaration")),
      t.property("tabIndex", t.number()),
      t.property("title", t.string()),
      t.property("translate", t.boolean())
    ),
    t.extends("Element")
  )
);
t.declare(
  t.class("HTMLCollection", _HTMLCollection => {
    const Elem = _HTMLCollection.typeParameter("Elem", t.ref("HTMLElement"));

    return [
      t.object(
        t.property("____iterator", t.function(t.return(t.ref(Iterator, Elem)))),
        t.property("length", t.number()),
        t.property(
          "item",
          t.function(
            t.param("nameOrIndex", t.any(), true),
            t.param("optionalIndex", t.any(), true),
            t.return(Elem)
          )
        ),
        t.property(
          "namedItem",
          t.function(t.param("name", t.string()), t.return(Elem))
        ),
        t.indexer("index", t.number(), Elem)
      )
    ];
  })
);
t.declare(
  t.class(
    "HTMLAnchorElement",
    t.object(
      t.property("charset", t.string()),
      t.property("coords", t.string()),
      t.property("download", t.string()),
      t.property("hash", t.string()),
      t.property("host", t.string()),
      t.property("hostname", t.string()),
      t.property("href", t.string()),
      t.property("hreflang", t.string()),
      t.property("media", t.string()),
      t.property("name", t.string()),
      t.property("origin", t.string()),
      t.property("password", t.string()),
      t.property("pathname", t.string()),
      t.property("port", t.string()),
      t.property("protocol", t.string()),
      t.property("rel", t.string()),
      t.property("rev", t.string()),
      t.property("search", t.string()),
      t.property("shape", t.string()),
      t.property("target", t.string()),
      t.property("text", t.string()),
      t.property("type", t.string()),
      t.property("username", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(t.class("HTMLAppletElement", t.object(), t.extends("HTMLElement")));
t.declare(
  t.class(
    "Attr",
    t.object(
      t.property("isId", t.boolean()),
      t.property("specified", t.boolean()),
      t.property("ownerElement", t.union(t.ref("Element"), t.null())),
      t.property("value", t.string()),
      t.property("name", t.string()),
      t.property("namespaceURI", t.union(t.string(), t.null())),
      t.property("prefix", t.union(t.string(), t.null())),
      t.property("localName", t.string())
    ),
    t.extends("Node")
  )
);
t.declare(
  t.class(
    "CharacterData",
    t.object(
      t.property("length", t.number()),
      t.property("data", t.string()),
      t.property(
        "deleteData",
        t.function(
          t.param("offset", t.number()),
          t.param("count", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "replaceData",
        t.function(
          t.param("offset", t.number()),
          t.param("count", t.number()),
          t.param("arg", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "appendData",
        t.function(t.param("arg", t.string()), t.return(t.void()))
      ),
      t.property(
        "insertData",
        t.function(
          t.param("offset", t.number()),
          t.param("arg", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "substringData",
        t.function(
          t.param("offset", t.number()),
          t.param("count", t.number()),
          t.return(t.string())
        )
      )
    ),
    t.extends("Node")
  )
);
t.declare(
  t.class(
    "HTMLSlotElement",
    t.object(
      t.property("name", t.string()),
      t.property(
        "assignedNodes",
        t.function(
          t.param(
            "options",
            t.object(t.property("flatten", t.boolean())),
            true
          ),
          t.return(t.array(t.ref("Node")))
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "Text",
    t.object(
      t.property("assignedSlot", t.ref("HTMLSlotElement"), true),
      t.property("wholeText", t.string()),
      t.property(
        "splitText",
        t.function(t.param("offset", t.number()), t.return(t.ref("Text")))
      ),
      t.property(
        "replaceWholeText",
        t.function(t.param("content", t.string()), t.return(t.ref("Text")))
      )
    ),
    t.extends("CharacterData")
  )
);
t.declare(
  t.class(
    "Comment",
    t.object(t.property("text", t.string())),
    t.extends("CharacterData")
  )
);
t.declare(
  t.class(
    "DocumentFragment",
    t.object(
      t.property("childElementCount", t.number()),
      t.property("children", t.ref("HTMLCollection", t.ref("HTMLElement"))),
      t.property("firstElementChild", t.nullable(t.ref("Element"))),
      t.property("lastElementChild", t.nullable(t.ref("Element"))),
      t.property(
        "querySelector",
        t.function(
          t.param("selector", t.string()),
          t.return(t.union(t.ref("HTMLElement"), t.null()))
        )
      ),
      t.property(
        "querySelectorAll",
        t.function(
          t.param("selector", t.string()),
          t.return(t.ref("NodeList", t.ref("HTMLElement")))
        )
      )
    ),
    t.extends("Node")
  )
);
t.declare(
  t.class(
    "MediaError",
    t.object(
      t.property("MEDIA_ERR_ABORTED", t.number()),
      t.property("MEDIA_ERR_NETWORK", t.number()),
      t.property("MEDIA_ERR_DECODE", t.number()),
      t.property("MEDIA_ERR_SRC_NOT_SUPPORTED", t.number()),
      t.property("code", t.number())
    )
  )
);
t.declare(
  t.class(
    "TimeRanges",
    t.object(
      t.property("length", t.number()),
      t.property(
        "start",
        t.function(t.param("index", t.number()), t.return(t.number()))
      ),
      t.property(
        "end",
        t.function(t.param("index", t.number()), t.return(t.number()))
      )
    )
  )
);
t.declare(
  t.class(
    "Date",
    t.object(
      t.staticCallProperty(t.function(t.return(t.string()))),
      t.property(
        "constructor",
        t.function(
          t.param("value", t.union(t.number(), t.string()), true),
          t.param("month", t.number(), true),
          t.param("day", t.number(), true),
          t.param("hour", t.number(), true),
          t.param("minute", t.number(), true),
          t.param("second", t.number(), true),
          t.param("millisecond", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property("getDate", t.function(t.return(t.number()))),
      t.property("getDay", t.function(t.return(t.number()))),
      t.property("getFullYear", t.function(t.return(t.number()))),
      t.property("getHours", t.function(t.return(t.number()))),
      t.property("getMilliseconds", t.function(t.return(t.number()))),
      t.property("getMinutes", t.function(t.return(t.number()))),
      t.property("getMonth", t.function(t.return(t.number()))),
      t.property("getSeconds", t.function(t.return(t.number()))),
      t.property("getTime", t.function(t.return(t.number()))),
      t.property("getTimezoneOffset", t.function(t.return(t.number()))),
      t.property("getUTCDate", t.function(t.return(t.number()))),
      t.property("getUTCDay", t.function(t.return(t.number()))),
      t.property("getUTCFullYear", t.function(t.return(t.number()))),
      t.property("getUTCHours", t.function(t.return(t.number()))),
      t.property("getUTCMilliseconds", t.function(t.return(t.number()))),
      t.property("getUTCMinutes", t.function(t.return(t.number()))),
      t.property("getUTCMonth", t.function(t.return(t.number()))),
      t.property("getUTCSeconds", t.function(t.return(t.number()))),
      t.property(
        "setDate",
        t.function(t.param("date", t.number()), t.return(t.number()))
      ),
      t.property(
        "setFullYear",
        t.function(
          t.param("year", t.number()),
          t.param("month", t.number(), true),
          t.param("date", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setHours",
        t.function(
          t.param("hours", t.number()),
          t.param("min", t.number(), true),
          t.param("sec", t.number(), true),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setMilliseconds",
        t.function(t.param("ms", t.number()), t.return(t.number()))
      ),
      t.property(
        "setMinutes",
        t.function(
          t.param("min", t.number()),
          t.param("sec", t.number(), true),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setMonth",
        t.function(
          t.param("month", t.number()),
          t.param("date", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setSeconds",
        t.function(
          t.param("sec", t.number()),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setTime",
        t.function(t.param("time", t.number()), t.return(t.number()))
      ),
      t.property(
        "setUTCDate",
        t.function(t.param("date", t.number()), t.return(t.number()))
      ),
      t.property(
        "setUTCFullYear",
        t.function(
          t.param("year", t.number()),
          t.param("month", t.number(), true),
          t.param("date", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setUTCHours",
        t.function(
          t.param("hours", t.number()),
          t.param("min", t.number(), true),
          t.param("sec", t.number(), true),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setUTCMilliseconds",
        t.function(t.param("ms", t.number()), t.return(t.number()))
      ),
      t.property(
        "setUTCMinutes",
        t.function(
          t.param("min", t.number()),
          t.param("sec", t.number(), true),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setUTCMonth",
        t.function(
          t.param("month", t.number()),
          t.param("date", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "setUTCSeconds",
        t.function(
          t.param("sec", t.number()),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property("toDateString", t.function(t.return(t.string()))),
      t.property("toISOString", t.function(t.return(t.string()))),
      t.property(
        "toJSON",
        t.function(t.param("key", t.any(), true), t.return(t.string()))
      ),
      t.property("toLocaleDateString", t.function(t.return(t.string()))),
      t.property("toLocaleString", t.function(t.return(t.string()))),
      t.property("toLocaleTimeString", t.function(t.return(t.string()))),
      t.property("toTimeString", t.function(t.return(t.string()))),
      t.property("toUTCString", t.function(t.return(t.string()))),
      t.property("valueOf", t.function(t.return(t.number()))),
      t.staticProperty("now", t.function(t.return(t.number()))),
      t.staticProperty(
        "parse",
        t.function(t.param("s", t.string()), t.return(t.number()))
      ),
      t.staticProperty(
        "UTC",
        t.function(
          t.param("year", t.number()),
          t.param("month", t.number()),
          t.param("date", t.number(), true),
          t.param("hours", t.number(), true),
          t.param("minutes", t.number(), true),
          t.param("seconds", t.number(), true),
          t.param("ms", t.number(), true),
          t.return(t.number())
        )
      ),
      t.indexer(
        "key",
        t.ref("$SymbolToPrimitive"),
        t.function(
          t.param(
            "hint",
            t.union(t.string("string"), t.string("default"), t.string("number"))
          ),
          t.return(t.union(t.string(), t.number()))
        )
      )
    )
  )
);
t.declare(
  t.class(
    "AudioTrack",
    t.object(
      t.property("id", t.string()),
      t.property("kind", t.string()),
      t.property("label", t.string()),
      t.property("language", t.string()),
      t.property("enabled", t.boolean())
    )
  )
);
t.declare(
  t.class(
    "AudioTrackList",
    t.object(
      t.property("length", t.number()),
      t.property(
        "getTrackById",
        t.function(
          t.param("id", t.string()),
          t.return(t.nullable(t.ref("AudioTrack")))
        )
      ),
      t.property(
        "onchange",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onaddtrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onremovetrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.indexer("index", t.number(), t.ref("AudioTrack"))
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "VideoTrack",
    t.object(
      t.property("id", t.string()),
      t.property("kind", t.string()),
      t.property("label", t.string()),
      t.property("language", t.string()),
      t.property("selected", t.boolean())
    )
  )
);
t.declare(
  t.class(
    "VideoTrackList",
    t.object(
      t.property("length", t.number()),
      t.property(
        "getTrackById",
        t.function(
          t.param("id", t.string()),
          t.return(t.nullable(t.ref("VideoTrack")))
        )
      ),
      t.property("selectedIndex", t.number()),
      t.property(
        "onchange",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onaddtrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onremovetrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.indexer("index", t.number(), t.ref("VideoTrack"))
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "TextTrackCue",
    t.object(
      t.property(
        "constructor",
        t.function(
          t.param("startTime", t.number()),
          t.param("endTime", t.number()),
          t.param("text", t.string()),
          t.return(t.void())
        )
      ),
      t.property("track", t.ref("TextTrack")),
      t.property("id", t.string()),
      t.property("startTime", t.number()),
      t.property("endTime", t.number()),
      t.property("pauseOnExit", t.boolean()),
      t.property("vertical", t.string()),
      t.property("snapToLines", t.boolean()),
      t.property("lines", t.number()),
      t.property("position", t.number()),
      t.property("size", t.number()),
      t.property("align", t.string()),
      t.property("text", t.string()),
      t.property("getCueAsHTML", t.function(t.return(t.ref("Node")))),
      t.property(
        "onenter",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onexit",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      )
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "TextTrackCueList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("TextTrackCue"))))
      ),
      t.property("length", t.number()),
      t.property(
        "getCueById",
        t.function(
          t.param("id", t.string()),
          t.return(t.nullable(t.ref("TextTrackCue")))
        )
      ),
      t.indexer("index", t.number(), t.ref("TextTrackCue"))
    )
  )
);
t.declare(
  t.class(
    "TextTrack",
    t.object(
      t.property("kind", t.string()),
      t.property("label", t.string()),
      t.property("language", t.string()),
      t.property("mode", t.string()),
      t.property("cues", t.ref("TextTrackCueList")),
      t.property("activeCues", t.ref("TextTrackCueList")),
      t.property(
        "addCue",
        t.function(t.param("cue", t.ref("TextTrackCue")), t.return(t.void()))
      ),
      t.property(
        "removeCue",
        t.function(t.param("cue", t.ref("TextTrackCue")), t.return(t.void()))
      ),
      t.property(
        "oncuechange",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      )
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "TextTrackList",
    t.object(
      t.property("length", t.number()),
      t.property(
        "onaddtrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.property(
        "onremovetrack",
        t.function(t.param("ev", t.any()), t.return(t.any()))
      ),
      t.indexer("index", t.number(), t.ref("TextTrack"))
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "HTMLMediaElement",
    t.object(
      t.property("error", t.nullable(t.ref("MediaError"))),
      t.property("src", t.string()),
      t.property("srcObject", t.nullable(t.any())),
      t.property("currentSrc", t.string()),
      t.property("crossOrigin", t.nullable(t.string())),
      t.property("NETWORK_EMPTY", t.number()),
      t.property("NETWORK_IDLE", t.number()),
      t.property("NETWORK_LOADING", t.number()),
      t.property("NETWORK_NO_SOURCE", t.number()),
      t.property("networkState", t.number()),
      t.property("preload", t.string()),
      t.property("buffered", t.ref("TimeRanges")),
      t.property("load", t.function(t.return(t.void()))),
      t.property(
        "canPlayType",
        t.function(t.param("type", t.string()), t.return(t.string()))
      ),
      t.property("HAVE_NOTHING", t.number()),
      t.property("HAVE_METADATA", t.number()),
      t.property("HAVE_CURRENT_DATA", t.number()),
      t.property("HAVE_FUTURE_DATA", t.number()),
      t.property("HAVE_ENOUGH_DATA", t.number()),
      t.property("readyState", t.number()),
      t.property("seeking", t.boolean()),
      t.property("currentTime", t.number()),
      t.property("duration", t.number()),
      t.property("startDate", t.ref("Date")),
      t.property("paused", t.boolean()),
      t.property("defaultPlaybackRate", t.number()),
      t.property("playbackRate", t.number()),
      t.property("played", t.ref("TimeRanges")),
      t.property("seekable", t.ref("TimeRanges")),
      t.property("ended", t.boolean()),
      t.property("autoplay", t.boolean()),
      t.property("loop", t.boolean()),
      t.property("play", t.function(t.return(t.void()))),
      t.property("pause", t.function(t.return(t.void()))),
      t.property("fastSeek", t.function(t.return(t.void()))),
      t.property("mediaGroup", t.string()),
      t.property("controller", t.nullable(t.any())),
      t.property("controls", t.boolean()),
      t.property("volume", t.number()),
      t.property("muted", t.boolean()),
      t.property("defaultMuted", t.boolean()),
      t.property("audioTracks", t.ref("AudioTrackList")),
      t.property("videoTracks", t.ref("VideoTrackList")),
      t.property("textTracks", t.ref("TextTrackList")),
      t.property(
        "addTextTrack",
        t.function(
          t.param("kind", t.string()),
          t.param("label", t.string(), true),
          t.param("language", t.string(), true),
          t.return(t.ref("TextTrack"))
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class("HTMLAudioElement", t.object(), t.extends("HTMLMediaElement"))
);
t.declare(
  t.class(
    "HTMLFormElement",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("HTMLElement"))))
      ),
      t.property("acceptCharset", t.string()),
      t.property("action", t.string()),
      t.property("elements", t.ref("HTMLCollection", t.ref("HTMLElement"))),
      t.property("encoding", t.string()),
      t.property("enctype", t.string()),
      t.property("length", t.number()),
      t.property("method", t.string()),
      t.property("name", t.string()),
      t.property("target", t.string()),
      t.property("checkValidity", t.function(t.return(t.boolean()))),
      t.property(
        "item",
        t.function(
          t.param("name", t.any(), true),
          t.param("index", t.any(), true),
          t.return(t.any())
        )
      ),
      t.property(
        "namedItem",
        t.function(t.param("name", t.string()), t.return(t.any()))
      ),
      t.property("reset", t.function(t.return(t.void()))),
      t.property("submit", t.function(t.return(t.void()))),
      t.indexer("name", t.string(), t.any())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLButtonElement",
    t.object(
      t.property("disabled", t.boolean()),
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("name", t.string()),
      t.property("type", t.string()),
      t.property("value", t.string()),
      t.property("checkValidity", t.function(t.return(t.boolean())))
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "SVGMatrix",
    t.object(
      t.property(
        "getComponent",
        t.function(t.param("index", t.number()), t.return(t.number()))
      ),
      t.property(
        "mMultiply",
        t.function(
          t.param("secondMatrix", t.ref("SVGMatrix")),
          t.return(t.ref("SVGMatrix"))
        )
      ),
      t.property("inverse", t.function(t.return(t.ref("SVGMatrix")))),
      t.property(
        "mTranslate",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.ref("SVGMatrix"))
        )
      ),
      t.property(
        "mScale",
        t.function(
          t.param("scaleFactor", t.number()),
          t.return(t.ref("SVGMatrix"))
        )
      ),
      t.property(
        "mRotate",
        t.function(t.param("angle", t.number()), t.return(t.ref("SVGMatrix")))
      )
    )
  )
);
t.declare(
  t.class(
    "CanvasGradient",
    t.object(
      t.property(
        "addColorStop",
        t.function(
          t.param("offset", t.number()),
          t.param("color", t.string()),
          t.return(t.void())
        )
      )
    )
  )
);
t.declare(
  t.class(
    "CanvasPattern",
    t.object(
      t.property(
        "setTransform",
        t.function(t.param("matrix", t.ref("SVGMatrix")), t.return(t.void()))
      )
    )
  )
);
t.declare(
  t.class(
    "HTMLImageElement",
    t.object(
      t.property("alt", t.string()),
      t.property("complete", t.boolean()),
      t.property("crossOrigin", t.nullable(t.string())),
      t.property("currentSrc", t.string()),
      t.property("height", t.number()),
      t.property("isMap", t.boolean()),
      t.property("naturalHeight", t.number()),
      t.property("naturalWidth", t.number()),
      t.property("sizes", t.string()),
      t.property("src", t.string()),
      t.property("srcset", t.string()),
      t.property("useMap", t.string()),
      t.property("width", t.number())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLVideoElement",
    t.object(
      t.property("width", t.number()),
      t.property("height", t.number()),
      t.property("videoWidth", t.number()),
      t.property("videoHeight", t.number()),
      t.property("poster", t.string())
    ),
    t.extends("HTMLMediaElement")
  )
);
t.declare(
  t.class(
    "ImageBitmap",
    t.object(
      t.property("close", t.function(t.return(t.void()))),
      t.property("width", t.number()),
      t.property("height", t.number())
    )
  )
);
const CanvasImageSource = t.type(
  "CanvasImageSource",
  t.union(
    t.ref("HTMLImageElement"),
    t.ref("HTMLVideoElement"),
    t.ref("HTMLCanvasElement"),
    t.ref("CanvasRenderingContext2D"),
    t.ref("ImageBitmap")
  )
);
const CanvasFillRule = t.type("CanvasFillRule", t.string());
t.declare(
  t.class(
    "CanvasDrawingStyles",
    t.object(
      t.property("lineWidth", t.number()),
      t.property("lineCap", t.string()),
      t.property("lineJoin", t.string()),
      t.property("miterLimit", t.number()),
      t.property(
        "setLineDash",
        t.function(t.param("segments", t.array(t.number())), t.return(t.void()))
      ),
      t.property("getLineDash", t.function(t.return(t.array(t.number())))),
      t.property("lineDashOffset", t.number()),
      t.property("font", t.string()),
      t.property("textAlign", t.string()),
      t.property("textBaseline", t.string()),
      t.property("direction", t.string())
    )
  )
);
t.declare(
  t.class(
    "Path2D",
    t.object(
      t.property(
        "addPath",
        t.function(
          t.param("path", t.ref("Path2D")),
          t.param("transformation", t.nullable(t.ref("SVGMatrix")), true),
          t.return(t.void())
        )
      ),
      t.property(
        "addPathByStrokingPath",
        t.function(
          t.param("path", t.ref("Path2D")),
          t.param("styles", t.ref("CanvasDrawingStyles")),
          t.param("transformation", t.nullable(t.ref("SVGMatrix")), true),
          t.return(t.void())
        )
      ),
      t.property(
        "addText",
        t.union(
          t.function(
            t.param("text", t.string()),
            t.param("styles", t.ref("CanvasDrawingStyles")),
            t.param("transformation", t.nullable(t.ref("SVGMatrix"))),
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.param("maxWidth", t.number(), true),
            t.return(t.void())
          ),
          t.function(
            t.param("text", t.string()),
            t.param("styles", t.ref("CanvasDrawingStyles")),
            t.param("transformation", t.nullable(t.ref("SVGMatrix"))),
            t.param("path", t.ref("Path2D")),
            t.param("maxWidth", t.number(), true),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "addPathByStrokingText",
        t.union(
          t.function(
            t.param("text", t.string()),
            t.param("styles", t.ref("CanvasDrawingStyles")),
            t.param("transformation", t.nullable(t.ref("SVGMatrix"))),
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.param("maxWidth", t.number(), true),
            t.return(t.void())
          ),
          t.function(
            t.param("text", t.string()),
            t.param("styles", t.ref("CanvasDrawingStyles")),
            t.param("transformation", t.nullable(t.ref("SVGMatrix"))),
            t.param("path", t.ref("Path2D")),
            t.param("maxWidth", t.number(), true),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "arc",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("radius", t.number()),
          t.param("startAngle", t.number()),
          t.param("endAngle", t.number()),
          t.param("anticlockwise", t.boolean(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "arcTo",
        t.union(
          t.function(
            t.param("x1", t.number()),
            t.param("y1", t.number()),
            t.param("x2", t.number()),
            t.param("y2", t.number()),
            t.param("radius", t.number()),
            t.param("_", t.void()),
            t.param("_", t.void()),
            t.return(t.void())
          ),
          t.function(
            t.param("x1", t.number()),
            t.param("y1", t.number()),
            t.param("x2", t.number()),
            t.param("y2", t.number()),
            t.param("radiusX", t.number()),
            t.param("radiusY", t.number()),
            t.param("rotation", t.number()),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "bezierCurveTo",
        t.function(
          t.param("cp1x", t.number()),
          t.param("cp1y", t.number()),
          t.param("cp2x", t.number()),
          t.param("cp2y", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property("closePath", t.function(t.return(t.void()))),
      t.property(
        "ellipse",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("radiusX", t.number()),
          t.param("radiusY", t.number()),
          t.param("rotation", t.number()),
          t.param("startAngle", t.number()),
          t.param("endAngle", t.number()),
          t.param("anticlockwise", t.boolean(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "lineTo",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "moveTo",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "quadraticCurveTo",
        t.function(
          t.param("cpx", t.number()),
          t.param("cpy", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "rect",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("w", t.number()),
          t.param("h", t.number()),
          t.return(t.void())
        )
      )
    )
  )
);
t.declare(
  t.class(
    "TextMetrics",
    t.object(
      t.property("width", t.number()),
      t.property("actualBoundingBoxLeft", t.number()),
      t.property("actualBoundingBoxRight", t.number()),
      t.property("fontBoundingBoxAscent", t.number()),
      t.property("fontBoundingBoxDescent", t.number()),
      t.property("actualBoundingBoxAscent", t.number()),
      t.property("actualBoundingBoxDescent", t.number()),
      t.property("emHeightAscent", t.number()),
      t.property("emHeightDescent", t.number()),
      t.property("hangingBaseline", t.number()),
      t.property("alphabeticBaseline", t.number()),
      t.property("ideographicBaseline", t.number())
    )
  )
);
t.declare(
  t.class(
    "HitRegionOptions",
    t.object(
      t.property("path", t.ref("Path2D"), true),
      t.property("fillRule", CanvasFillRule, true),
      t.property("id", t.string(), true),
      t.property("parentID", t.string(), true),
      t.property("cursor", t.string(), true),
      t.property("control", t.ref("Element"), true),
      t.property("label", t.nullable(t.string())),
      t.property("role", t.nullable(t.string()))
    )
  )
);
t.declare(
  t.class(
    "ArrayBuffer",
    t.object(
      t.staticProperty(
        "isView",
        t.function(t.param("arg", t.mixed()), t.return(t.boolean()))
      ),
      t.property(
        "constructor",
        t.function(t.param("byteLength", t.number()), t.return(t.void()))
      ),
      t.property("byteLength", t.number()),
      t.property(
        "slice",
        t.function(
          t.param("begin", t.number()),
          t.param("end", t.number(), true),
          t.return(t.ref("this"))
        )
      ),
      t.indexer("key", t.ref("$SymbolSpecies"), t.function())
    )
  )
);
t.declare(
  t.class(
    "$TypedArray",
    t.object(
      t.staticProperty("BYTES_PER_ELEMENT", t.number()),
      t.staticProperty(
        "from",
        t.function(
          t.param("iterable", t.ref(Iterable, t.number())),
          t.param(
            "mapFn",
            t.function(t.param("element", t.number()), t.return(t.number())),
            true
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.ref("this"))
        )
      ),
      t.staticProperty(
        "of",
        t.function(
          t.rest("values", t.array(t.number())),
          t.return(t.ref("this"))
        )
      ),
      t.property(
        "constructor",
        t.union(
          t.function(t.param("length", t.number()), t.return(t.void())),
          t.function(
            t.param("typedArray", t.ref("$TypedArray")),
            t.return(t.void())
          ),
          t.function(
            t.param("iterable", t.ref(Iterable, t.number())),
            t.return(t.void())
          ),
          t.function(
            t.param("buffer", t.ref("ArrayBuffer")),
            t.param("byteOffset", t.number(), true),
            t.param("length", t.number(), true),
            t.return(t.void())
          )
        )
      ),
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.number())))
      ),
      t.property("buffer", t.ref("ArrayBuffer")),
      t.property("byteLength", t.number()),
      t.property("byteOffset", t.number()),
      t.property("length", t.number()),
      t.property(
        "copyWithin",
        t.function(
          t.param("target", t.number()),
          t.param("start", t.number()),
          t.param("end", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "entries",
        t.function(t.return(t.ref(Iterator, t.tuple(t.number(), t.number()))))
      ),
      t.property(
        "every",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "fill",
        t.function(
          t.param("value", t.number()),
          t.param("start", t.number(), true),
          t.param("end", t.number(), true),
          t.return(t.ref("this"))
        )
      ),
      t.property(
        "filter",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.ref("this"))
        )
      ),
      t.property(
        "find",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.union(t.number(), t.void()))
        )
      ),
      t.property(
        "findIndex",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
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
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "includes",
        t.function(
          t.param("searchElement", t.number()),
          t.param("fromIndex", t.number(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "indexOf",
        t.function(
          t.param("searchElement", t.number()),
          t.param("fromIndex", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "join",
        t.function(t.param("separator", t.string(), true), t.return(t.string()))
      ),
      t.property("keys", t.function(t.return(t.ref(Iterator, t.number())))),
      t.property(
        "lastIndexOf",
        t.function(
          t.param("searchElement", t.number()),
          t.param("fromIndex", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "map",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("currentValue", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.number())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.ref("this"))
        )
      ),
      t.property(
        "reduce",
        t.union(
          t.function(
            t.param(
              "callback",
              t.function(
                t.param("previousValue", t.number()),
                t.param("currentValue", t.number()),
                t.param("index", t.number()),
                t.param("array", t.ref("this")),
                t.return(t.number())
              )
            ),
            t.param("initialValue", t.void()),
            t.return(t.number())
          ),
          t.function(_fn15 => {
            const U = _fn15.typeParameter("U");

            return [
              t.param(
                "callback",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", t.number()),
                  t.param("index", t.number()),
                  t.param("array", t.ref("this")),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        )
      ),
      t.property(
        "reduceRight",
        t.union(
          t.function(
            t.param(
              "callback",
              t.function(
                t.param("previousValue", t.number()),
                t.param("currentValue", t.number()),
                t.param("index", t.number()),
                t.param("array", t.ref("this")),
                t.return(t.number())
              )
            ),
            t.param("initialValue", t.void()),
            t.return(t.number())
          ),
          t.function(_fn16 => {
            const U = _fn16.typeParameter("U");

            return [
              t.param(
                "callback",
                t.function(
                  t.param("previousValue", U),
                  t.param("currentValue", t.number()),
                  t.param("index", t.number()),
                  t.param("array", t.ref("this")),
                  t.return(U)
                )
              ),
              t.param("initialValue", U),
              t.return(U)
            ];
          })
        )
      ),
      t.property("reverse", t.function(t.return(t.ref("this")))),
      t.property(
        "set",
        t.function(
          t.param("array", t.union(t.array(t.number()), t.ref("$TypedArray"))),
          t.param("offset", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "slice",
        t.function(
          t.param("begin", t.number(), true),
          t.param("end", t.number(), true),
          t.return(t.ref("this"))
        )
      ),
      t.property(
        "some",
        t.function(
          t.param(
            "callback",
            t.function(
              t.param("value", t.number()),
              t.param("index", t.number()),
              t.param("array", t.ref("this")),
              t.return(t.mixed())
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
            "compare",
            t.function(
              t.param("a", t.number()),
              t.param("b", t.number()),
              t.return(t.number())
            ),
            true
          ),
          t.return(t.void())
        )
      ),
      t.property(
        "subarray",
        t.function(
          t.param("begin", t.number(), true),
          t.param("end", t.number(), true),
          t.return(t.ref("this"))
        )
      ),
      t.property("values", t.function(t.return(t.ref(Iterator, t.number())))),
      t.indexer("index", t.number(), t.number())
    )
  )
);
t.declare(t.class("Uint8ClampedArray", t.object(), t.extends("$TypedArray")));
t.declare(
  t.class(
    "ImageData",
    t.object(
      t.property("width", t.number()),
      t.property("height", t.number()),
      t.property("data", t.ref("Uint8ClampedArray"))
    )
  )
);
t.declare(
  t.class(
    "CanvasRenderingContext2D",
    t.object(
      t.property("canvas", t.ref("HTMLCanvasElement")),
      t.property("width", t.number()),
      t.property("height", t.number()),
      t.property("commit", t.function(t.return(t.void()))),
      t.property("save", t.function(t.return(t.void()))),
      t.property("restore", t.function(t.return(t.void()))),
      t.property("currentTransform", t.ref("SVGMatrix")),
      t.property(
        "scale",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "rotate",
        t.function(t.param("angle", t.number()), t.return(t.void()))
      ),
      t.property(
        "translate",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "transform",
        t.function(
          t.param("a", t.number()),
          t.param("b", t.number()),
          t.param("c", t.number()),
          t.param("d", t.number()),
          t.param("e", t.number()),
          t.param("f", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "setTransform",
        t.function(
          t.param("a", t.number()),
          t.param("b", t.number()),
          t.param("c", t.number()),
          t.param("d", t.number()),
          t.param("e", t.number()),
          t.param("f", t.number()),
          t.return(t.void())
        )
      ),
      t.property("resetTransform", t.function(t.return(t.void()))),
      t.property("globalAlpha", t.number()),
      t.property("globalCompositeOperation", t.string()),
      t.property("imageSmoothingEnabled", t.boolean()),
      t.property(
        "strokeStyle",
        t.union(t.string(), t.ref("CanvasGradient"), t.ref("CanvasPattern"))
      ),
      t.property(
        "fillStyle",
        t.union(t.string(), t.ref("CanvasGradient"), t.ref("CanvasPattern"))
      ),
      t.property(
        "createLinearGradient",
        t.function(
          t.param("x0", t.number()),
          t.param("y0", t.number()),
          t.param("x1", t.number()),
          t.param("y1", t.number()),
          t.return(t.ref("CanvasGradient"))
        )
      ),
      t.property(
        "createRadialGradient",
        t.function(
          t.param("x0", t.number()),
          t.param("y0", t.number()),
          t.param("r0", t.number()),
          t.param("x1", t.number()),
          t.param("y1", t.number()),
          t.param("r1", t.number()),
          t.return(t.ref("CanvasGradient"))
        )
      ),
      t.property(
        "createPattern",
        t.function(
          t.param("image", CanvasImageSource),
          t.param("repetition", t.nullable(t.string())),
          t.return(t.ref("CanvasPattern"))
        )
      ),
      t.property("shadowOffsetX", t.number()),
      t.property("shadowOffsetY", t.number()),
      t.property("shadowBlur", t.number()),
      t.property("shadowColor", t.string()),
      t.property(
        "clearRect",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("w", t.number()),
          t.param("h", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "fillRect",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("w", t.number()),
          t.param("h", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "strokeRect",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("w", t.number()),
          t.param("h", t.number()),
          t.return(t.void())
        )
      ),
      t.property("beginPath", t.function(t.return(t.void()))),
      t.property(
        "fill",
        t.union(
          t.function(
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.void())
          ),
          t.function(
            t.param("path", t.ref("Path2D")),
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "stroke",
        t.union(
          t.function(t.return(t.void())),
          t.function(t.param("path", t.ref("Path2D")), t.return(t.void()))
        )
      ),
      t.property(
        "drawFocusIfNeeded",
        t.union(
          t.function(t.param("element", t.ref("Element")), t.return(t.void())),
          t.function(
            t.param("path", t.ref("Path2D")),
            t.param("element", t.ref("Element")),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "scrollPathIntoView",
        t.union(
          t.function(t.return(t.void())),
          t.function(t.param("path", t.ref("Path2D")), t.return(t.void()))
        )
      ),
      t.property(
        "clip",
        t.union(
          t.function(
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.void())
          ),
          t.function(
            t.param("path", t.ref("Path2D")),
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.void())
          )
        )
      ),
      t.property("resetClip", t.function(t.return(t.void()))),
      t.property(
        "isPointInPath",
        t.union(
          t.function(
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.boolean())
          ),
          t.function(
            t.param("path", t.ref("Path2D")),
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.param("fillRule", CanvasFillRule, true),
            t.return(t.boolean())
          )
        )
      ),
      t.property(
        "isPointInStroke",
        t.union(
          t.function(
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.return(t.boolean())
          ),
          t.function(
            t.param("path", t.ref("Path2D")),
            t.param("x", t.number()),
            t.param("y", t.number()),
            t.return(t.boolean())
          )
        )
      ),
      t.property(
        "fillText",
        t.function(
          t.param("text", t.string()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("maxWidth", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "strokeText",
        t.function(
          t.param("text", t.string()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("maxWidth", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "measureText",
        t.function(t.param("text", t.string()), t.return(t.ref("TextMetrics")))
      ),
      t.property(
        "drawImage",
        t.union(
          t.function(
            t.param("image", CanvasImageSource),
            t.param("dx", t.number()),
            t.param("dy", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("image", CanvasImageSource),
            t.param("dx", t.number()),
            t.param("dy", t.number()),
            t.param("dw", t.number()),
            t.param("dh", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("image", CanvasImageSource),
            t.param("sx", t.number()),
            t.param("sy", t.number()),
            t.param("sw", t.number()),
            t.param("sh", t.number()),
            t.param("dx", t.number()),
            t.param("dy", t.number()),
            t.param("dw", t.number()),
            t.param("dh", t.number()),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "addHitRegion",
        t.function(
          t.param("options", t.ref("HitRegionOptions"), true),
          t.return(t.void())
        )
      ),
      t.property(
        "removeHitRegion",
        t.function(t.param("id", t.string()), t.return(t.void()))
      ),
      t.property("clearHitRegions", t.function(t.return(t.void()))),
      t.property(
        "createImageData",
        t.union(
          t.function(
            t.param("sw", t.number()),
            t.param("sh", t.number()),
            t.return(t.ref("ImageData"))
          ),
          t.function(
            t.param("imagedata", t.ref("ImageData")),
            t.return(t.ref("ImageData"))
          )
        )
      ),
      t.property(
        "getImageData",
        t.function(
          t.param("sx", t.number()),
          t.param("sy", t.number()),
          t.param("sw", t.number()),
          t.param("sh", t.number()),
          t.return(t.ref("ImageData"))
        )
      ),
      t.property(
        "putImageData",
        t.union(
          t.function(
            t.param("imagedata", t.ref("ImageData")),
            t.param("dx", t.number()),
            t.param("dy", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("imagedata", t.ref("ImageData")),
            t.param("dx", t.number()),
            t.param("dy", t.number()),
            t.param("dirtyX", t.number()),
            t.param("dirtyY", t.number()),
            t.param("dirtyWidth", t.number()),
            t.param("dirtyHeight", t.number()),
            t.return(t.void())
          )
        )
      ),
      t.property("lineWidth", t.number()),
      t.property("lineCap", t.string()),
      t.property("lineJoin", t.string()),
      t.property("miterLimit", t.number()),
      t.property(
        "setLineDash",
        t.function(t.param("segments", t.array(t.number())), t.return(t.void()))
      ),
      t.property("getLineDash", t.function(t.return(t.array(t.number())))),
      t.property("lineDashOffset", t.number()),
      t.property("font", t.string()),
      t.property("textAlign", t.string()),
      t.property("textBaseline", t.string()),
      t.property("direction", t.string()),
      t.property("closePath", t.function(t.return(t.void()))),
      t.property(
        "moveTo",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "lineTo",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "quadraticCurveTo",
        t.function(
          t.param("cpx", t.number()),
          t.param("cpy", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "bezierCurveTo",
        t.function(
          t.param("cp1x", t.number()),
          t.param("cp1y", t.number()),
          t.param("cp2x", t.number()),
          t.param("cp2y", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "arcTo",
        t.union(
          t.function(
            t.param("x1", t.number()),
            t.param("y1", t.number()),
            t.param("x2", t.number()),
            t.param("y2", t.number()),
            t.param("radius", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("x1", t.number()),
            t.param("y1", t.number()),
            t.param("x2", t.number()),
            t.param("y2", t.number()),
            t.param("radiusX", t.number()),
            t.param("radiusY", t.number()),
            t.param("rotation", t.number()),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "rect",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("w", t.number()),
          t.param("h", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "arc",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("radius", t.number()),
          t.param("startAngle", t.number()),
          t.param("endAngle", t.number()),
          t.param("anticlockwise", t.boolean(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "ellipse",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("radiusX", t.number()),
          t.param("radiusY", t.number()),
          t.param("rotation", t.number()),
          t.param("startAngle", t.number()),
          t.param("endAngle", t.number()),
          t.param("anticlockwise", t.boolean(), true),
          t.return(t.void())
        )
      )
    )
  )
);
const WebGLContextAttributes = t.type(
  "WebGLContextAttributes",
  t.object(
    t.property("alpha", t.boolean()),
    t.property("depth", t.boolean()),
    t.property("stencil", t.boolean()),
    t.property("antialias", t.boolean()),
    t.property("premultipliedAlpha", t.boolean()),
    t.property("preserveDrawingBuffer", t.boolean()),
    t.property("preferLowPowerToHighPerformance", t.boolean()),
    t.property("failIfMajorPerformanceCaveat", t.boolean())
  )
);
const WebGLObject = t.type("WebGLObject", t.object());
const WebGLProgram = t.type(
  "WebGLProgram",
  t.intersect(WebGLObject, t.object())
);
const WebGLShader = t.type("WebGLShader", t.intersect(WebGLObject, t.object()));
const WebGLBuffer = t.type("WebGLBuffer", t.intersect(WebGLObject, t.object()));
const WebGLFramebuffer = t.type(
  "WebGLFramebuffer",
  t.intersect(WebGLObject, t.object())
);
const WebGLRenderbuffer = t.type(
  "WebGLRenderbuffer",
  t.intersect(WebGLObject, t.object())
);
const WebGLTexture = t.type(
  "WebGLTexture",
  t.intersect(WebGLObject, t.object())
);
const BufferDataSource = t.type(
  "BufferDataSource",
  t.union(t.ref("ArrayBuffer"), t.ref("$ArrayBufferView"))
);
const WebGLActiveInfo = t.type(
  "WebGLActiveInfo",
  t.object(
    t.property("size", t.number()),
    t.property("type", t.number()),
    t.property("name", t.string())
  )
);
const WebGLShaderPrecisionFormat = t.type(
  "WebGLShaderPrecisionFormat",
  t.object(
    t.property("rangeMin", t.number()),
    t.property("rangeMax", t.number()),
    t.property("precision", t.number())
  )
);
const WebGLUniformLocation = t.type("WebGLUniformLocation", t.object());
const TexImageSource = t.type(
  "TexImageSource",
  t.union(
    t.ref("ImageBitmap"),
    t.ref("ImageData"),
    t.ref("HTMLImageElement"),
    t.ref("HTMLCanvasElement"),
    t.ref("HTMLVideoElement")
  )
);
t.declare(t.class("Float32Array", t.object(), t.extends("$TypedArray")));
t.declare(t.class("Int32Array", t.object(), t.extends("$TypedArray")));
const VertexAttribFVSource = t.type(
  "VertexAttribFVSource",
  t.union(t.ref("Float32Array"), t.array(t.number()))
);
t.declare(
  t.class(
    "WebGLRenderingContext",
    t.object(
      t.staticProperty("DEPTH_BUFFER_BIT", t.number(256)),
      t.property("DEPTH_BUFFER_BIT", t.number(256)),
      t.staticProperty("STENCIL_BUFFER_BIT", t.number(1024)),
      t.property("STENCIL_BUFFER_BIT", t.number(1024)),
      t.staticProperty("COLOR_BUFFER_BIT", t.number(16384)),
      t.property("COLOR_BUFFER_BIT", t.number(16384)),
      t.staticProperty("POINTS", t.number(0)),
      t.property("POINTS", t.number(0)),
      t.staticProperty("LINES", t.number(1)),
      t.property("LINES", t.number(1)),
      t.staticProperty("LINE_LOOP", t.number(2)),
      t.property("LINE_LOOP", t.number(2)),
      t.staticProperty("LINE_STRIP", t.number(3)),
      t.property("LINE_STRIP", t.number(3)),
      t.staticProperty("TRIANGLES", t.number(4)),
      t.property("TRIANGLES", t.number(4)),
      t.staticProperty("TRIANGLE_STRIP", t.number(5)),
      t.property("TRIANGLE_STRIP", t.number(5)),
      t.staticProperty("TRIANGLE_FAN", t.number(6)),
      t.property("TRIANGLE_FAN", t.number(6)),
      t.staticProperty("ZERO", t.number(0)),
      t.property("ZERO", t.number(0)),
      t.staticProperty("ONE", t.number(1)),
      t.property("ONE", t.number(1)),
      t.staticProperty("SRC_COLOR", t.number(768)),
      t.property("SRC_COLOR", t.number(768)),
      t.staticProperty("ONE_MINUS_SRC_COLOR", t.number(769)),
      t.property("ONE_MINUS_SRC_COLOR", t.number(769)),
      t.staticProperty("SRC_ALPHA", t.number(770)),
      t.property("SRC_ALPHA", t.number(770)),
      t.staticProperty("ONE_MINUS_SRC_ALPHA", t.number(771)),
      t.property("ONE_MINUS_SRC_ALPHA", t.number(771)),
      t.staticProperty("DST_ALPHA", t.number(772)),
      t.property("DST_ALPHA", t.number(772)),
      t.staticProperty("ONE_MINUS_DST_ALPHA", t.number(773)),
      t.property("ONE_MINUS_DST_ALPHA", t.number(773)),
      t.staticProperty("DST_COLOR", t.number(774)),
      t.property("DST_COLOR", t.number(774)),
      t.staticProperty("ONE_MINUS_DST_COLOR", t.number(775)),
      t.property("ONE_MINUS_DST_COLOR", t.number(775)),
      t.staticProperty("SRC_ALPHA_SATURATE", t.number(776)),
      t.property("SRC_ALPHA_SATURATE", t.number(776)),
      t.staticProperty("FUNC_ADD", t.number(32774)),
      t.property("FUNC_ADD", t.number(32774)),
      t.staticProperty("BLEND_EQUATION", t.number(32777)),
      t.property("BLEND_EQUATION", t.number(32777)),
      t.staticProperty("BLEND_EQUATION_RGB", t.number(32777)),
      t.property("BLEND_EQUATION_RGB", t.number(32777)),
      t.staticProperty("BLEND_EQUATION_ALPHA", t.number(34877)),
      t.property("BLEND_EQUATION_ALPHA", t.number(34877)),
      t.staticProperty("FUNC_SUBTRACT", t.number(32778)),
      t.property("FUNC_SUBTRACT", t.number(32778)),
      t.staticProperty("FUNC_REVERSE_SUBTRACT", t.number(32779)),
      t.property("FUNC_REVERSE_SUBTRACT", t.number(32779)),
      t.staticProperty("BLEND_DST_RGB", t.number(32968)),
      t.property("BLEND_DST_RGB", t.number(32968)),
      t.staticProperty("BLEND_SRC_RGB", t.number(32969)),
      t.property("BLEND_SRC_RGB", t.number(32969)),
      t.staticProperty("BLEND_DST_ALPHA", t.number(32970)),
      t.property("BLEND_DST_ALPHA", t.number(32970)),
      t.staticProperty("BLEND_SRC_ALPHA", t.number(32971)),
      t.property("BLEND_SRC_ALPHA", t.number(32971)),
      t.staticProperty("CONSTANT_COLOR", t.number(32769)),
      t.property("CONSTANT_COLOR", t.number(32769)),
      t.staticProperty("ONE_MINUS_CONSTANT_COLOR", t.number(32770)),
      t.property("ONE_MINUS_CONSTANT_COLOR", t.number(32770)),
      t.staticProperty("CONSTANT_ALPHA", t.number(32771)),
      t.property("CONSTANT_ALPHA", t.number(32771)),
      t.staticProperty("ONE_MINUS_CONSTANT_ALPHA", t.number(32772)),
      t.property("ONE_MINUS_CONSTANT_ALPHA", t.number(32772)),
      t.staticProperty("BLEND_COLOR", t.number(32773)),
      t.property("BLEND_COLOR", t.number(32773)),
      t.staticProperty("ARRAY_BUFFER", t.number(34962)),
      t.property("ARRAY_BUFFER", t.number(34962)),
      t.staticProperty("ELEMENT_ARRAY_BUFFER", t.number(34963)),
      t.property("ELEMENT_ARRAY_BUFFER", t.number(34963)),
      t.staticProperty("ARRAY_BUFFER_BINDING", t.number(34964)),
      t.property("ARRAY_BUFFER_BINDING", t.number(34964)),
      t.staticProperty("ELEMENT_ARRAY_BUFFER_BINDING", t.number(34965)),
      t.property("ELEMENT_ARRAY_BUFFER_BINDING", t.number(34965)),
      t.staticProperty("STREAM_DRAW", t.number(35040)),
      t.property("STREAM_DRAW", t.number(35040)),
      t.staticProperty("STATIC_DRAW", t.number(35044)),
      t.property("STATIC_DRAW", t.number(35044)),
      t.staticProperty("DYNAMIC_DRAW", t.number(35048)),
      t.property("DYNAMIC_DRAW", t.number(35048)),
      t.staticProperty("BUFFER_SIZE", t.number(34660)),
      t.property("BUFFER_SIZE", t.number(34660)),
      t.staticProperty("BUFFER_USAGE", t.number(34661)),
      t.property("BUFFER_USAGE", t.number(34661)),
      t.staticProperty("CURRENT_VERTEX_ATTRIB", t.number(34342)),
      t.property("CURRENT_VERTEX_ATTRIB", t.number(34342)),
      t.staticProperty("FRONT", t.number(1028)),
      t.property("FRONT", t.number(1028)),
      t.staticProperty("BACK", t.number(1029)),
      t.property("BACK", t.number(1029)),
      t.staticProperty("FRONT_AND_BACK", t.number(1032)),
      t.property("FRONT_AND_BACK", t.number(1032)),
      t.staticProperty("CULL_FACE", t.number(2884)),
      t.property("CULL_FACE", t.number(2884)),
      t.staticProperty("BLEND", t.number(3042)),
      t.property("BLEND", t.number(3042)),
      t.staticProperty("DITHER", t.number(3024)),
      t.property("DITHER", t.number(3024)),
      t.staticProperty("STENCIL_TEST", t.number(2960)),
      t.property("STENCIL_TEST", t.number(2960)),
      t.staticProperty("DEPTH_TEST", t.number(2929)),
      t.property("DEPTH_TEST", t.number(2929)),
      t.staticProperty("SCISSOR_TEST", t.number(3089)),
      t.property("SCISSOR_TEST", t.number(3089)),
      t.staticProperty("POLYGON_OFFSET_FILL", t.number(32823)),
      t.property("POLYGON_OFFSET_FILL", t.number(32823)),
      t.staticProperty("SAMPLE_ALPHA_TO_COVERAGE", t.number(32926)),
      t.property("SAMPLE_ALPHA_TO_COVERAGE", t.number(32926)),
      t.staticProperty("SAMPLE_COVERAGE", t.number(32928)),
      t.property("SAMPLE_COVERAGE", t.number(32928)),
      t.staticProperty("NO_ERROR", t.number(0)),
      t.property("NO_ERROR", t.number(0)),
      t.staticProperty("INVALID_ENUM", t.number(1280)),
      t.property("INVALID_ENUM", t.number(1280)),
      t.staticProperty("INVALID_VALUE", t.number(1281)),
      t.property("INVALID_VALUE", t.number(1281)),
      t.staticProperty("INVALID_OPERATION", t.number(1282)),
      t.property("INVALID_OPERATION", t.number(1282)),
      t.staticProperty("OUT_OF_MEMORY", t.number(1285)),
      t.property("OUT_OF_MEMORY", t.number(1285)),
      t.staticProperty("CW", t.number(2304)),
      t.property("CW", t.number(2304)),
      t.staticProperty("CCW", t.number(2305)),
      t.property("CCW", t.number(2305)),
      t.staticProperty("LINE_WIDTH", t.number(2849)),
      t.property("LINE_WIDTH", t.number(2849)),
      t.staticProperty("ALIASED_POINT_SIZE_RANGE", t.number(33901)),
      t.property("ALIASED_POINT_SIZE_RANGE", t.number(33901)),
      t.staticProperty("ALIASED_LINE_WIDTH_RANGE", t.number(33902)),
      t.property("ALIASED_LINE_WIDTH_RANGE", t.number(33902)),
      t.staticProperty("CULL_FACE_MODE", t.number(2885)),
      t.property("CULL_FACE_MODE", t.number(2885)),
      t.staticProperty("FRONT_FACE", t.number(2886)),
      t.property("FRONT_FACE", t.number(2886)),
      t.staticProperty("DEPTH_RANGE", t.number(2928)),
      t.property("DEPTH_RANGE", t.number(2928)),
      t.staticProperty("DEPTH_WRITEMASK", t.number(2930)),
      t.property("DEPTH_WRITEMASK", t.number(2930)),
      t.staticProperty("DEPTH_CLEAR_VALUE", t.number(2931)),
      t.property("DEPTH_CLEAR_VALUE", t.number(2931)),
      t.staticProperty("DEPTH_FUNC", t.number(2932)),
      t.property("DEPTH_FUNC", t.number(2932)),
      t.staticProperty("STENCIL_CLEAR_VALUE", t.number(2961)),
      t.property("STENCIL_CLEAR_VALUE", t.number(2961)),
      t.staticProperty("STENCIL_FUNC", t.number(2962)),
      t.property("STENCIL_FUNC", t.number(2962)),
      t.staticProperty("STENCIL_FAIL", t.number(2964)),
      t.property("STENCIL_FAIL", t.number(2964)),
      t.staticProperty("STENCIL_PASS_DEPTH_FAIL", t.number(2965)),
      t.property("STENCIL_PASS_DEPTH_FAIL", t.number(2965)),
      t.staticProperty("STENCIL_PASS_DEPTH_PASS", t.number(2966)),
      t.property("STENCIL_PASS_DEPTH_PASS", t.number(2966)),
      t.staticProperty("STENCIL_REF", t.number(2967)),
      t.property("STENCIL_REF", t.number(2967)),
      t.staticProperty("STENCIL_VALUE_MASK", t.number(2963)),
      t.property("STENCIL_VALUE_MASK", t.number(2963)),
      t.staticProperty("STENCIL_WRITEMASK", t.number(2968)),
      t.property("STENCIL_WRITEMASK", t.number(2968)),
      t.staticProperty("STENCIL_BACK_FUNC", t.number(34816)),
      t.property("STENCIL_BACK_FUNC", t.number(34816)),
      t.staticProperty("STENCIL_BACK_FAIL", t.number(34817)),
      t.property("STENCIL_BACK_FAIL", t.number(34817)),
      t.staticProperty("STENCIL_BACK_PASS_DEPTH_FAIL", t.number(34818)),
      t.property("STENCIL_BACK_PASS_DEPTH_FAIL", t.number(34818)),
      t.staticProperty("STENCIL_BACK_PASS_DEPTH_PASS", t.number(34819)),
      t.property("STENCIL_BACK_PASS_DEPTH_PASS", t.number(34819)),
      t.staticProperty("STENCIL_BACK_REF", t.number(36003)),
      t.property("STENCIL_BACK_REF", t.number(36003)),
      t.staticProperty("STENCIL_BACK_VALUE_MASK", t.number(36004)),
      t.property("STENCIL_BACK_VALUE_MASK", t.number(36004)),
      t.staticProperty("STENCIL_BACK_WRITEMASK", t.number(36005)),
      t.property("STENCIL_BACK_WRITEMASK", t.number(36005)),
      t.staticProperty("VIEWPORT", t.number(2978)),
      t.property("VIEWPORT", t.number(2978)),
      t.staticProperty("SCISSOR_BOX", t.number(3088)),
      t.property("SCISSOR_BOX", t.number(3088)),
      t.staticProperty("COLOR_CLEAR_VALUE", t.number(3106)),
      t.property("COLOR_CLEAR_VALUE", t.number(3106)),
      t.staticProperty("COLOR_WRITEMASK", t.number(3107)),
      t.property("COLOR_WRITEMASK", t.number(3107)),
      t.staticProperty("UNPACK_ALIGNMENT", t.number(3317)),
      t.property("UNPACK_ALIGNMENT", t.number(3317)),
      t.staticProperty("PACK_ALIGNMENT", t.number(3333)),
      t.property("PACK_ALIGNMENT", t.number(3333)),
      t.staticProperty("MAX_TEXTURE_SIZE", t.number(3379)),
      t.property("MAX_TEXTURE_SIZE", t.number(3379)),
      t.staticProperty("MAX_VIEWPORT_DIMS", t.number(3386)),
      t.property("MAX_VIEWPORT_DIMS", t.number(3386)),
      t.staticProperty("SUBPIXEL_BITS", t.number(3408)),
      t.property("SUBPIXEL_BITS", t.number(3408)),
      t.staticProperty("RED_BITS", t.number(3410)),
      t.property("RED_BITS", t.number(3410)),
      t.staticProperty("GREEN_BITS", t.number(3411)),
      t.property("GREEN_BITS", t.number(3411)),
      t.staticProperty("BLUE_BITS", t.number(3412)),
      t.property("BLUE_BITS", t.number(3412)),
      t.staticProperty("ALPHA_BITS", t.number(3413)),
      t.property("ALPHA_BITS", t.number(3413)),
      t.staticProperty("DEPTH_BITS", t.number(3414)),
      t.property("DEPTH_BITS", t.number(3414)),
      t.staticProperty("STENCIL_BITS", t.number(3415)),
      t.property("STENCIL_BITS", t.number(3415)),
      t.staticProperty("POLYGON_OFFSET_UNITS", t.number(10752)),
      t.property("POLYGON_OFFSET_UNITS", t.number(10752)),
      t.staticProperty("POLYGON_OFFSET_FACTOR", t.number(32824)),
      t.property("POLYGON_OFFSET_FACTOR", t.number(32824)),
      t.staticProperty("TEXTURE_BINDING_2D", t.number(32873)),
      t.property("TEXTURE_BINDING_2D", t.number(32873)),
      t.staticProperty("SAMPLE_BUFFERS", t.number(32936)),
      t.property("SAMPLE_BUFFERS", t.number(32936)),
      t.staticProperty("SAMPLES", t.number(32937)),
      t.property("SAMPLES", t.number(32937)),
      t.staticProperty("SAMPLE_COVERAGE_VALUE", t.number(32938)),
      t.property("SAMPLE_COVERAGE_VALUE", t.number(32938)),
      t.staticProperty("SAMPLE_COVERAGE_INVERT", t.number(32939)),
      t.property("SAMPLE_COVERAGE_INVERT", t.number(32939)),
      t.staticProperty("COMPRESSED_TEXTURE_FORMATS", t.number(34467)),
      t.property("COMPRESSED_TEXTURE_FORMATS", t.number(34467)),
      t.staticProperty("DONT_CARE", t.number(4352)),
      t.property("DONT_CARE", t.number(4352)),
      t.staticProperty("FASTEST", t.number(4353)),
      t.property("FASTEST", t.number(4353)),
      t.staticProperty("NICEST", t.number(4354)),
      t.property("NICEST", t.number(4354)),
      t.staticProperty("GENERATE_MIPMAP_HINT", t.number(33170)),
      t.property("GENERATE_MIPMAP_HINT", t.number(33170)),
      t.staticProperty("BYTE", t.number(5120)),
      t.property("BYTE", t.number(5120)),
      t.staticProperty("UNSIGNED_BYTE", t.number(5121)),
      t.property("UNSIGNED_BYTE", t.number(5121)),
      t.staticProperty("SHORT", t.number(5122)),
      t.property("SHORT", t.number(5122)),
      t.staticProperty("UNSIGNED_SHORT", t.number(5123)),
      t.property("UNSIGNED_SHORT", t.number(5123)),
      t.staticProperty("INT", t.number(5124)),
      t.property("INT", t.number(5124)),
      t.staticProperty("UNSIGNED_INT", t.number(5125)),
      t.property("UNSIGNED_INT", t.number(5125)),
      t.staticProperty("FLOAT", t.number(5126)),
      t.property("FLOAT", t.number(5126)),
      t.staticProperty("DEPTH_COMPONENT", t.number(6402)),
      t.property("DEPTH_COMPONENT", t.number(6402)),
      t.staticProperty("ALPHA", t.number(6406)),
      t.property("ALPHA", t.number(6406)),
      t.staticProperty("RGB", t.number(6407)),
      t.property("RGB", t.number(6407)),
      t.staticProperty("RGBA", t.number(6408)),
      t.property("RGBA", t.number(6408)),
      t.staticProperty("LUMINANCE", t.number(6409)),
      t.property("LUMINANCE", t.number(6409)),
      t.staticProperty("LUMINANCE_ALPHA", t.number(6410)),
      t.property("LUMINANCE_ALPHA", t.number(6410)),
      t.staticProperty("UNSIGNED_SHORT_4_4_4_4", t.number(32819)),
      t.property("UNSIGNED_SHORT_4_4_4_4", t.number(32819)),
      t.staticProperty("UNSIGNED_SHORT_5_5_5_1", t.number(32820)),
      t.property("UNSIGNED_SHORT_5_5_5_1", t.number(32820)),
      t.staticProperty("UNSIGNED_SHORT_5_6_5", t.number(33635)),
      t.property("UNSIGNED_SHORT_5_6_5", t.number(33635)),
      t.staticProperty("FRAGMENT_SHADER", t.number(35632)),
      t.property("FRAGMENT_SHADER", t.number(35632)),
      t.staticProperty("VERTEX_SHADER", t.number(35633)),
      t.property("VERTEX_SHADER", t.number(35633)),
      t.staticProperty("MAX_VERTEX_ATTRIBS", t.number(34921)),
      t.property("MAX_VERTEX_ATTRIBS", t.number(34921)),
      t.staticProperty("MAX_VERTEX_UNIFORM_VECTORS", t.number(36347)),
      t.property("MAX_VERTEX_UNIFORM_VECTORS", t.number(36347)),
      t.staticProperty("MAX_VARYING_VECTORS", t.number(36348)),
      t.property("MAX_VARYING_VECTORS", t.number(36348)),
      t.staticProperty("MAX_COMBINED_TEXTURE_IMAGE_UNITS", t.number(35661)),
      t.property("MAX_COMBINED_TEXTURE_IMAGE_UNITS", t.number(35661)),
      t.staticProperty("MAX_VERTEX_TEXTURE_IMAGE_UNITS", t.number(35660)),
      t.property("MAX_VERTEX_TEXTURE_IMAGE_UNITS", t.number(35660)),
      t.staticProperty("MAX_TEXTURE_IMAGE_UNITS", t.number(34930)),
      t.property("MAX_TEXTURE_IMAGE_UNITS", t.number(34930)),
      t.staticProperty("MAX_FRAGMENT_UNIFORM_VECTORS", t.number(36349)),
      t.property("MAX_FRAGMENT_UNIFORM_VECTORS", t.number(36349)),
      t.staticProperty("SHADER_TYPE", t.number(35663)),
      t.property("SHADER_TYPE", t.number(35663)),
      t.staticProperty("DELETE_STATUS", t.number(35712)),
      t.property("DELETE_STATUS", t.number(35712)),
      t.staticProperty("LINK_STATUS", t.number(35714)),
      t.property("LINK_STATUS", t.number(35714)),
      t.staticProperty("VALIDATE_STATUS", t.number(35715)),
      t.property("VALIDATE_STATUS", t.number(35715)),
      t.staticProperty("ATTACHED_SHADERS", t.number(35717)),
      t.property("ATTACHED_SHADERS", t.number(35717)),
      t.staticProperty("ACTIVE_UNIFORMS", t.number(35718)),
      t.property("ACTIVE_UNIFORMS", t.number(35718)),
      t.staticProperty("ACTIVE_ATTRIBUTES", t.number(35721)),
      t.property("ACTIVE_ATTRIBUTES", t.number(35721)),
      t.staticProperty("SHADING_LANGUAGE_VERSION", t.number(35724)),
      t.property("SHADING_LANGUAGE_VERSION", t.number(35724)),
      t.staticProperty("CURRENT_PROGRAM", t.number(35725)),
      t.property("CURRENT_PROGRAM", t.number(35725)),
      t.staticProperty("NEVER", t.number(512)),
      t.property("NEVER", t.number(512)),
      t.staticProperty("LESS", t.number(513)),
      t.property("LESS", t.number(513)),
      t.staticProperty("EQUAL", t.number(514)),
      t.property("EQUAL", t.number(514)),
      t.staticProperty("LEQUAL", t.number(515)),
      t.property("LEQUAL", t.number(515)),
      t.staticProperty("GREATER", t.number(516)),
      t.property("GREATER", t.number(516)),
      t.staticProperty("NOTEQUAL", t.number(517)),
      t.property("NOTEQUAL", t.number(517)),
      t.staticProperty("GEQUAL", t.number(518)),
      t.property("GEQUAL", t.number(518)),
      t.staticProperty("ALWAYS", t.number(519)),
      t.property("ALWAYS", t.number(519)),
      t.staticProperty("KEEP", t.number(7680)),
      t.property("KEEP", t.number(7680)),
      t.staticProperty("REPLACE", t.number(7681)),
      t.property("REPLACE", t.number(7681)),
      t.staticProperty("INCR", t.number(7682)),
      t.property("INCR", t.number(7682)),
      t.staticProperty("DECR", t.number(7683)),
      t.property("DECR", t.number(7683)),
      t.staticProperty("INVERT", t.number(5386)),
      t.property("INVERT", t.number(5386)),
      t.staticProperty("INCR_WRAP", t.number(34055)),
      t.property("INCR_WRAP", t.number(34055)),
      t.staticProperty("DECR_WRAP", t.number(34056)),
      t.property("DECR_WRAP", t.number(34056)),
      t.staticProperty("VENDOR", t.number(7936)),
      t.property("VENDOR", t.number(7936)),
      t.staticProperty("RENDERER", t.number(7937)),
      t.property("RENDERER", t.number(7937)),
      t.staticProperty("VERSION", t.number(7938)),
      t.property("VERSION", t.number(7938)),
      t.staticProperty("NEAREST", t.number(9728)),
      t.property("NEAREST", t.number(9728)),
      t.staticProperty("LINEAR", t.number(9729)),
      t.property("LINEAR", t.number(9729)),
      t.staticProperty("NEAREST_MIPMAP_NEAREST", t.number(9984)),
      t.property("NEAREST_MIPMAP_NEAREST", t.number(9984)),
      t.staticProperty("LINEAR_MIPMAP_NEAREST", t.number(9985)),
      t.property("LINEAR_MIPMAP_NEAREST", t.number(9985)),
      t.staticProperty("NEAREST_MIPMAP_LINEAR", t.number(9986)),
      t.property("NEAREST_MIPMAP_LINEAR", t.number(9986)),
      t.staticProperty("LINEAR_MIPMAP_LINEAR", t.number(9987)),
      t.property("LINEAR_MIPMAP_LINEAR", t.number(9987)),
      t.staticProperty("TEXTURE_MAG_FILTER", t.number(10240)),
      t.property("TEXTURE_MAG_FILTER", t.number(10240)),
      t.staticProperty("TEXTURE_MIN_FILTER", t.number(10241)),
      t.property("TEXTURE_MIN_FILTER", t.number(10241)),
      t.staticProperty("TEXTURE_WRAP_S", t.number(10242)),
      t.property("TEXTURE_WRAP_S", t.number(10242)),
      t.staticProperty("TEXTURE_WRAP_T", t.number(10243)),
      t.property("TEXTURE_WRAP_T", t.number(10243)),
      t.staticProperty("TEXTURE_2D", t.number(3553)),
      t.property("TEXTURE_2D", t.number(3553)),
      t.staticProperty("TEXTURE", t.number(5890)),
      t.property("TEXTURE", t.number(5890)),
      t.staticProperty("TEXTURE_CUBE_MAP", t.number(34067)),
      t.property("TEXTURE_CUBE_MAP", t.number(34067)),
      t.staticProperty("TEXTURE_BINDING_CUBE_MAP", t.number(34068)),
      t.property("TEXTURE_BINDING_CUBE_MAP", t.number(34068)),
      t.staticProperty("TEXTURE_CUBE_MAP_POSITIVE_X", t.number(34069)),
      t.property("TEXTURE_CUBE_MAP_POSITIVE_X", t.number(34069)),
      t.staticProperty("TEXTURE_CUBE_MAP_NEGATIVE_X", t.number(34070)),
      t.property("TEXTURE_CUBE_MAP_NEGATIVE_X", t.number(34070)),
      t.staticProperty("TEXTURE_CUBE_MAP_POSITIVE_Y", t.number(34071)),
      t.property("TEXTURE_CUBE_MAP_POSITIVE_Y", t.number(34071)),
      t.staticProperty("TEXTURE_CUBE_MAP_NEGATIVE_Y", t.number(34072)),
      t.property("TEXTURE_CUBE_MAP_NEGATIVE_Y", t.number(34072)),
      t.staticProperty("TEXTURE_CUBE_MAP_POSITIVE_Z", t.number(34073)),
      t.property("TEXTURE_CUBE_MAP_POSITIVE_Z", t.number(34073)),
      t.staticProperty("TEXTURE_CUBE_MAP_NEGATIVE_Z", t.number(34074)),
      t.property("TEXTURE_CUBE_MAP_NEGATIVE_Z", t.number(34074)),
      t.staticProperty("MAX_CUBE_MAP_TEXTURE_SIZE", t.number(34076)),
      t.property("MAX_CUBE_MAP_TEXTURE_SIZE", t.number(34076)),
      t.staticProperty("TEXTURE0", t.number(33984)),
      t.property("TEXTURE0", t.number(33984)),
      t.staticProperty("TEXTURE1", t.number(33985)),
      t.property("TEXTURE1", t.number(33985)),
      t.staticProperty("TEXTURE2", t.number(33986)),
      t.property("TEXTURE2", t.number(33986)),
      t.staticProperty("TEXTURE3", t.number(33987)),
      t.property("TEXTURE3", t.number(33987)),
      t.staticProperty("TEXTURE4", t.number(33988)),
      t.property("TEXTURE4", t.number(33988)),
      t.staticProperty("TEXTURE5", t.number(33989)),
      t.property("TEXTURE5", t.number(33989)),
      t.staticProperty("TEXTURE6", t.number(33990)),
      t.property("TEXTURE6", t.number(33990)),
      t.staticProperty("TEXTURE7", t.number(33991)),
      t.property("TEXTURE7", t.number(33991)),
      t.staticProperty("TEXTURE8", t.number(33992)),
      t.property("TEXTURE8", t.number(33992)),
      t.staticProperty("TEXTURE9", t.number(33993)),
      t.property("TEXTURE9", t.number(33993)),
      t.staticProperty("TEXTURE10", t.number(33994)),
      t.property("TEXTURE10", t.number(33994)),
      t.staticProperty("TEXTURE11", t.number(33995)),
      t.property("TEXTURE11", t.number(33995)),
      t.staticProperty("TEXTURE12", t.number(33996)),
      t.property("TEXTURE12", t.number(33996)),
      t.staticProperty("TEXTURE13", t.number(33997)),
      t.property("TEXTURE13", t.number(33997)),
      t.staticProperty("TEXTURE14", t.number(33998)),
      t.property("TEXTURE14", t.number(33998)),
      t.staticProperty("TEXTURE15", t.number(33999)),
      t.property("TEXTURE15", t.number(33999)),
      t.staticProperty("TEXTURE16", t.number(34000)),
      t.property("TEXTURE16", t.number(34000)),
      t.staticProperty("TEXTURE17", t.number(34001)),
      t.property("TEXTURE17", t.number(34001)),
      t.staticProperty("TEXTURE18", t.number(34002)),
      t.property("TEXTURE18", t.number(34002)),
      t.staticProperty("TEXTURE19", t.number(34003)),
      t.property("TEXTURE19", t.number(34003)),
      t.staticProperty("TEXTURE20", t.number(34004)),
      t.property("TEXTURE20", t.number(34004)),
      t.staticProperty("TEXTURE21", t.number(34005)),
      t.property("TEXTURE21", t.number(34005)),
      t.staticProperty("TEXTURE22", t.number(34006)),
      t.property("TEXTURE22", t.number(34006)),
      t.staticProperty("TEXTURE23", t.number(34007)),
      t.property("TEXTURE23", t.number(34007)),
      t.staticProperty("TEXTURE24", t.number(34008)),
      t.property("TEXTURE24", t.number(34008)),
      t.staticProperty("TEXTURE25", t.number(34009)),
      t.property("TEXTURE25", t.number(34009)),
      t.staticProperty("TEXTURE26", t.number(34010)),
      t.property("TEXTURE26", t.number(34010)),
      t.staticProperty("TEXTURE27", t.number(34011)),
      t.property("TEXTURE27", t.number(34011)),
      t.staticProperty("TEXTURE28", t.number(34012)),
      t.property("TEXTURE28", t.number(34012)),
      t.staticProperty("TEXTURE29", t.number(34013)),
      t.property("TEXTURE29", t.number(34013)),
      t.staticProperty("TEXTURE30", t.number(34014)),
      t.property("TEXTURE30", t.number(34014)),
      t.staticProperty("TEXTURE31", t.number(34015)),
      t.property("TEXTURE31", t.number(34015)),
      t.staticProperty("ACTIVE_TEXTURE", t.number(34016)),
      t.property("ACTIVE_TEXTURE", t.number(34016)),
      t.staticProperty("REPEAT", t.number(10497)),
      t.property("REPEAT", t.number(10497)),
      t.staticProperty("CLAMP_TO_EDGE", t.number(33071)),
      t.property("CLAMP_TO_EDGE", t.number(33071)),
      t.staticProperty("MIRRORED_REPEAT", t.number(33648)),
      t.property("MIRRORED_REPEAT", t.number(33648)),
      t.staticProperty("FLOAT_VEC2", t.number(35664)),
      t.property("FLOAT_VEC2", t.number(35664)),
      t.staticProperty("FLOAT_VEC3", t.number(35665)),
      t.property("FLOAT_VEC3", t.number(35665)),
      t.staticProperty("FLOAT_VEC4", t.number(35666)),
      t.property("FLOAT_VEC4", t.number(35666)),
      t.staticProperty("INT_VEC2", t.number(35667)),
      t.property("INT_VEC2", t.number(35667)),
      t.staticProperty("INT_VEC3", t.number(35668)),
      t.property("INT_VEC3", t.number(35668)),
      t.staticProperty("INT_VEC4", t.number(35669)),
      t.property("INT_VEC4", t.number(35669)),
      t.staticProperty("BOOL", t.number(35670)),
      t.property("BOOL", t.number(35670)),
      t.staticProperty("BOOL_VEC2", t.number(35671)),
      t.property("BOOL_VEC2", t.number(35671)),
      t.staticProperty("BOOL_VEC3", t.number(35672)),
      t.property("BOOL_VEC3", t.number(35672)),
      t.staticProperty("BOOL_VEC4", t.number(35673)),
      t.property("BOOL_VEC4", t.number(35673)),
      t.staticProperty("FLOAT_MAT2", t.number(35674)),
      t.property("FLOAT_MAT2", t.number(35674)),
      t.staticProperty("FLOAT_MAT3", t.number(35675)),
      t.property("FLOAT_MAT3", t.number(35675)),
      t.staticProperty("FLOAT_MAT4", t.number(35676)),
      t.property("FLOAT_MAT4", t.number(35676)),
      t.staticProperty("SAMPLER_2D", t.number(35678)),
      t.property("SAMPLER_2D", t.number(35678)),
      t.staticProperty("SAMPLER_CUBE", t.number(35680)),
      t.property("SAMPLER_CUBE", t.number(35680)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_ENABLED", t.number(34338)),
      t.property("VERTEX_ATTRIB_ARRAY_ENABLED", t.number(34338)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_SIZE", t.number(34339)),
      t.property("VERTEX_ATTRIB_ARRAY_SIZE", t.number(34339)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_STRIDE", t.number(34340)),
      t.property("VERTEX_ATTRIB_ARRAY_STRIDE", t.number(34340)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_TYPE", t.number(34341)),
      t.property("VERTEX_ATTRIB_ARRAY_TYPE", t.number(34341)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_NORMALIZED", t.number(34922)),
      t.property("VERTEX_ATTRIB_ARRAY_NORMALIZED", t.number(34922)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_POINTER", t.number(34373)),
      t.property("VERTEX_ATTRIB_ARRAY_POINTER", t.number(34373)),
      t.staticProperty("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", t.number(34975)),
      t.property("VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", t.number(34975)),
      t.staticProperty("IMPLEMENTATION_COLOR_READ_TYPE", t.number(35738)),
      t.property("IMPLEMENTATION_COLOR_READ_TYPE", t.number(35738)),
      t.staticProperty("IMPLEMENTATION_COLOR_READ_FORMAT", t.number(35739)),
      t.property("IMPLEMENTATION_COLOR_READ_FORMAT", t.number(35739)),
      t.staticProperty("COMPILE_STATUS", t.number(35713)),
      t.property("COMPILE_STATUS", t.number(35713)),
      t.staticProperty("LOW_FLOAT", t.number(36336)),
      t.property("LOW_FLOAT", t.number(36336)),
      t.staticProperty("MEDIUM_FLOAT", t.number(36337)),
      t.property("MEDIUM_FLOAT", t.number(36337)),
      t.staticProperty("HIGH_FLOAT", t.number(36338)),
      t.property("HIGH_FLOAT", t.number(36338)),
      t.staticProperty("LOW_INT", t.number(36339)),
      t.property("LOW_INT", t.number(36339)),
      t.staticProperty("MEDIUM_INT", t.number(36340)),
      t.property("MEDIUM_INT", t.number(36340)),
      t.staticProperty("HIGH_INT", t.number(36341)),
      t.property("HIGH_INT", t.number(36341)),
      t.staticProperty("FRAMEBUFFER", t.number(36160)),
      t.property("FRAMEBUFFER", t.number(36160)),
      t.staticProperty("RENDERBUFFER", t.number(36161)),
      t.property("RENDERBUFFER", t.number(36161)),
      t.staticProperty("RGBA4", t.number(32854)),
      t.property("RGBA4", t.number(32854)),
      t.staticProperty("RGB5_A1", t.number(32855)),
      t.property("RGB5_A1", t.number(32855)),
      t.staticProperty("RGB565", t.number(36194)),
      t.property("RGB565", t.number(36194)),
      t.staticProperty("DEPTH_COMPONENT16", t.number(33189)),
      t.property("DEPTH_COMPONENT16", t.number(33189)),
      t.staticProperty("STENCIL_INDEX", t.number(6401)),
      t.property("STENCIL_INDEX", t.number(6401)),
      t.staticProperty("STENCIL_INDEX8", t.number(36168)),
      t.property("STENCIL_INDEX8", t.number(36168)),
      t.staticProperty("DEPTH_STENCIL", t.number(34041)),
      t.property("DEPTH_STENCIL", t.number(34041)),
      t.staticProperty("RENDERBUFFER_WIDTH", t.number(36162)),
      t.property("RENDERBUFFER_WIDTH", t.number(36162)),
      t.staticProperty("RENDERBUFFER_HEIGHT", t.number(36163)),
      t.property("RENDERBUFFER_HEIGHT", t.number(36163)),
      t.staticProperty("RENDERBUFFER_INTERNAL_FORMAT", t.number(36164)),
      t.property("RENDERBUFFER_INTERNAL_FORMAT", t.number(36164)),
      t.staticProperty("RENDERBUFFER_RED_SIZE", t.number(36176)),
      t.property("RENDERBUFFER_RED_SIZE", t.number(36176)),
      t.staticProperty("RENDERBUFFER_GREEN_SIZE", t.number(36177)),
      t.property("RENDERBUFFER_GREEN_SIZE", t.number(36177)),
      t.staticProperty("RENDERBUFFER_BLUE_SIZE", t.number(36178)),
      t.property("RENDERBUFFER_BLUE_SIZE", t.number(36178)),
      t.staticProperty("RENDERBUFFER_ALPHA_SIZE", t.number(36179)),
      t.property("RENDERBUFFER_ALPHA_SIZE", t.number(36179)),
      t.staticProperty("RENDERBUFFER_DEPTH_SIZE", t.number(36180)),
      t.property("RENDERBUFFER_DEPTH_SIZE", t.number(36180)),
      t.staticProperty("RENDERBUFFER_STENCIL_SIZE", t.number(36181)),
      t.property("RENDERBUFFER_STENCIL_SIZE", t.number(36181)),
      t.staticProperty("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", t.number(36048)),
      t.property("FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", t.number(36048)),
      t.staticProperty("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", t.number(36049)),
      t.property("FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", t.number(36049)),
      t.staticProperty("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", t.number(36050)),
      t.property("FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", t.number(36050)),
      t.staticProperty(
        "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
        t.number(36051)
      ),
      t.property(
        "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
        t.number(36051)
      ),
      t.staticProperty("COLOR_ATTACHMENT0", t.number(36064)),
      t.property("COLOR_ATTACHMENT0", t.number(36064)),
      t.staticProperty("DEPTH_ATTACHMENT", t.number(36096)),
      t.property("DEPTH_ATTACHMENT", t.number(36096)),
      t.staticProperty("STENCIL_ATTACHMENT", t.number(36128)),
      t.property("STENCIL_ATTACHMENT", t.number(36128)),
      t.staticProperty("DEPTH_STENCIL_ATTACHMENT", t.number(33306)),
      t.property("DEPTH_STENCIL_ATTACHMENT", t.number(33306)),
      t.staticProperty("NONE", t.number(0)),
      t.property("NONE", t.number(0)),
      t.staticProperty("FRAMEBUFFER_COMPLETE", t.number(36053)),
      t.property("FRAMEBUFFER_COMPLETE", t.number(36053)),
      t.staticProperty("FRAMEBUFFER_INCOMPLETE_ATTACHMENT", t.number(36054)),
      t.property("FRAMEBUFFER_INCOMPLETE_ATTACHMENT", t.number(36054)),
      t.staticProperty(
        "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
        t.number(36055)
      ),
      t.property("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", t.number(36055)),
      t.staticProperty("FRAMEBUFFER_INCOMPLETE_DIMENSIONS", t.number(36057)),
      t.property("FRAMEBUFFER_INCOMPLETE_DIMENSIONS", t.number(36057)),
      t.staticProperty("FRAMEBUFFER_UNSUPPORTED", t.number(36061)),
      t.property("FRAMEBUFFER_UNSUPPORTED", t.number(36061)),
      t.staticProperty("FRAMEBUFFER_BINDING", t.number(36006)),
      t.property("FRAMEBUFFER_BINDING", t.number(36006)),
      t.staticProperty("RENDERBUFFER_BINDING", t.number(36007)),
      t.property("RENDERBUFFER_BINDING", t.number(36007)),
      t.staticProperty("MAX_RENDERBUFFER_SIZE", t.number(34024)),
      t.property("MAX_RENDERBUFFER_SIZE", t.number(34024)),
      t.staticProperty("INVALID_FRAMEBUFFER_OPERATION", t.number(1286)),
      t.property("INVALID_FRAMEBUFFER_OPERATION", t.number(1286)),
      t.staticProperty("UNPACK_FLIP_Y_WEBGL", t.number(37440)),
      t.property("UNPACK_FLIP_Y_WEBGL", t.number(37440)),
      t.staticProperty("UNPACK_PREMULTIPLY_ALPHA_WEBGL", t.number(37441)),
      t.property("UNPACK_PREMULTIPLY_ALPHA_WEBGL", t.number(37441)),
      t.staticProperty("CONTEXT_LOST_WEBGL", t.number(37442)),
      t.property("CONTEXT_LOST_WEBGL", t.number(37442)),
      t.staticProperty("UNPACK_COLORSPACE_CONVERSION_WEBGL", t.number(37443)),
      t.property("UNPACK_COLORSPACE_CONVERSION_WEBGL", t.number(37443)),
      t.staticProperty("BROWSER_DEFAULT_WEBGL", t.number(37444)),
      t.property("BROWSER_DEFAULT_WEBGL", t.number(37444)),
      t.property("canvas", t.ref("HTMLCanvasElement")),
      t.property("drawingBufferWidth", t.number()),
      t.property("drawingBufferHeight", t.number()),
      t.property(
        "getContextAttributes",
        t.function(t.return(t.nullable(WebGLContextAttributes)))
      ),
      t.property("isContextLost", t.function(t.return(t.boolean()))),
      t.property(
        "getSupportedExtensions",
        t.function(t.return(t.nullable(t.array(t.string()))))
      ),
      t.property(
        "getExtension",
        t.function(t.param("name", t.string()), t.return(t.any()))
      ),
      t.property(
        "activeTexture",
        t.function(t.param("texture", t.number()), t.return(t.void()))
      ),
      t.property(
        "attachShader",
        t.function(
          t.param("program", WebGLProgram),
          t.param("shader", WebGLShader),
          t.return(t.void())
        )
      ),
      t.property(
        "bindAttribLocation",
        t.function(
          t.param("program", WebGLProgram),
          t.param("index", t.number()),
          t.param("name", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "bindBuffer",
        t.function(
          t.param("target", t.number()),
          t.param("buffer", t.nullable(WebGLBuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "bindFramebuffer",
        t.function(
          t.param("target", t.number()),
          t.param("framebuffer", t.nullable(WebGLFramebuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "bindRenderbuffer",
        t.function(
          t.param("target", t.number()),
          t.param("renderbuffer", t.nullable(WebGLRenderbuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "bindTexture",
        t.function(
          t.param("target", t.number()),
          t.param("texture", t.nullable(WebGLTexture)),
          t.return(t.void())
        )
      ),
      t.property(
        "blendColor",
        t.function(
          t.param("red", t.number()),
          t.param("green", t.number()),
          t.param("blue", t.number()),
          t.param("alpha", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "blendEquation",
        t.function(t.param("mode", t.number()), t.return(t.void()))
      ),
      t.property(
        "blendEquationSeparate",
        t.function(
          t.param("modeRGB", t.number()),
          t.param("modeAlpha", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "blendFunc",
        t.function(
          t.param("sfactor", t.number()),
          t.param("dfactor", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "blendFuncSeparate",
        t.function(
          t.param("srcRGB", t.number()),
          t.param("dstRGB", t.number()),
          t.param("srcAlpha", t.number()),
          t.param("dstAlpha", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "bufferData",
        t.union(
          t.function(
            t.param("target", t.number()),
            t.param("size", t.number()),
            t.param("usage", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("target", t.number()),
            t.param("data", t.nullable(t.ref("ArrayBuffer"))),
            t.param("usage", t.number()),
            t.return(t.void())
          ),
          t.function(
            t.param("target", t.number()),
            t.param("data", t.ref("$ArrayBufferView")),
            t.param("usage", t.number()),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "bufferSubData",
        t.function(
          t.param("target", t.number()),
          t.param("offset", t.number()),
          t.param("data", BufferDataSource),
          t.return(t.void())
        )
      ),
      t.property(
        "checkFramebufferStatus",
        t.function(t.param("target", t.number()), t.return(t.number()))
      ),
      t.property(
        "clear",
        t.function(t.param("mask", t.number()), t.return(t.void()))
      ),
      t.property(
        "clearColor",
        t.function(
          t.param("red", t.number()),
          t.param("green", t.number()),
          t.param("blue", t.number()),
          t.param("alpha", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "clearDepth",
        t.function(t.param("depth", t.number()), t.return(t.void()))
      ),
      t.property(
        "clearStencil",
        t.function(t.param("s", t.number()), t.return(t.void()))
      ),
      t.property(
        "colorMask",
        t.function(
          t.param("red", t.boolean()),
          t.param("green", t.boolean()),
          t.param("blue", t.boolean()),
          t.param("alpha", t.boolean()),
          t.return(t.void())
        )
      ),
      t.property(
        "compileShader",
        t.function(t.param("shader", WebGLShader), t.return(t.void()))
      ),
      t.property(
        "compressedTexImage2D",
        t.function(
          t.param("target", t.number()),
          t.param("level", t.number()),
          t.param("internalformat", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.param("border", t.number()),
          t.param("data", t.ref("$ArrayBufferView")),
          t.return(t.void())
        )
      ),
      t.property(
        "compressedTexSubImage2D",
        t.function(
          t.param("target", t.number()),
          t.param("level", t.number()),
          t.param("xoffset", t.number()),
          t.param("yoffset", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.param("format", t.number()),
          t.param("data", t.ref("$ArrayBufferView")),
          t.return(t.void())
        )
      ),
      t.property(
        "copyTexImage2D",
        t.function(
          t.param("target", t.number()),
          t.param("level", t.number()),
          t.param("internalformat", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.param("border", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "copyTexSubImage2D",
        t.function(
          t.param("target", t.number()),
          t.param("level", t.number()),
          t.param("xoffset", t.number()),
          t.param("yoffset", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.return(t.void())
        )
      ),
      t.property("createBuffer", t.function(t.return(t.nullable(WebGLBuffer)))),
      t.property(
        "createFramebuffer",
        t.function(t.return(t.nullable(WebGLFramebuffer)))
      ),
      t.property(
        "createProgram",
        t.function(t.return(t.nullable(WebGLProgram)))
      ),
      t.property(
        "createRenderbuffer",
        t.function(t.return(t.nullable(WebGLRenderbuffer)))
      ),
      t.property(
        "createShader",
        t.function(
          t.param("type", t.number()),
          t.return(t.nullable(WebGLShader))
        )
      ),
      t.property(
        "createTexture",
        t.function(t.return(t.nullable(WebGLTexture)))
      ),
      t.property(
        "cullFace",
        t.function(t.param("mode", t.number()), t.return(t.void()))
      ),
      t.property(
        "deleteBuffer",
        t.function(
          t.param("buffer", t.nullable(WebGLBuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "deleteFramebuffer",
        t.function(
          t.param("framebuffer", t.nullable(WebGLFramebuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "deleteProgram",
        t.function(
          t.param("program", t.nullable(WebGLProgram)),
          t.return(t.void())
        )
      ),
      t.property(
        "deleteRenderbuffer",
        t.function(
          t.param("renderbuffer", t.nullable(WebGLRenderbuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "deleteShader",
        t.function(
          t.param("shader", t.nullable(WebGLShader)),
          t.return(t.void())
        )
      ),
      t.property(
        "deleteTexture",
        t.function(
          t.param("texture", t.nullable(WebGLTexture)),
          t.return(t.void())
        )
      ),
      t.property(
        "depthFunc",
        t.function(t.param("func", t.number()), t.return(t.void()))
      ),
      t.property(
        "depthMask",
        t.function(t.param("flag", t.boolean()), t.return(t.void()))
      ),
      t.property(
        "depthRange",
        t.function(
          t.param("zNear", t.number()),
          t.param("zFar", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "detachShader",
        t.function(
          t.param("program", WebGLProgram),
          t.param("shader", WebGLShader),
          t.return(t.void())
        )
      ),
      t.property(
        "disable",
        t.function(t.param("cap", t.number()), t.return(t.void()))
      ),
      t.property(
        "disableVertexAttribArray",
        t.function(t.param("index", t.number()), t.return(t.void()))
      ),
      t.property(
        "drawArrays",
        t.function(
          t.param("mode", t.number()),
          t.param("first", t.number()),
          t.param("count", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "drawElements",
        t.function(
          t.param("mode", t.number()),
          t.param("count", t.number()),
          t.param("type", t.number()),
          t.param("offset", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "enable",
        t.function(t.param("cap", t.number()), t.return(t.void()))
      ),
      t.property(
        "enableVertexAttribArray",
        t.function(t.param("index", t.number()), t.return(t.void()))
      ),
      t.property("finish", t.function(t.return(t.void()))),
      t.property("flush", t.function(t.return(t.void()))),
      t.property(
        "framebufferRenderbuffer",
        t.function(
          t.param("target", t.number()),
          t.param("attachment", t.number()),
          t.param("renderbuffertarget", t.number()),
          t.param("renderbuffer", t.nullable(WebGLRenderbuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "framebufferTexture2D",
        t.function(
          t.param("target", t.number()),
          t.param("attachment", t.number()),
          t.param("textarget", t.number()),
          t.param("texture", t.nullable(WebGLTexture)),
          t.param("level", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "frontFace",
        t.function(t.param("mode", t.number()), t.return(t.void()))
      ),
      t.property(
        "generateMipmap",
        t.function(t.param("target", t.number()), t.return(t.void()))
      ),
      t.property(
        "getActiveAttrib",
        t.function(
          t.param("program", WebGLProgram),
          t.param("index", t.number()),
          t.return(t.nullable(WebGLActiveInfo))
        )
      ),
      t.property(
        "getActiveUniform",
        t.function(
          t.param("program", WebGLProgram),
          t.param("index", t.number()),
          t.return(t.nullable(WebGLActiveInfo))
        )
      ),
      t.property(
        "getAttachedShaders",
        t.function(
          t.param("program", WebGLProgram),
          t.return(t.nullable(t.array(WebGLShader)))
        )
      ),
      t.property(
        "getAttribLocation",
        t.function(
          t.param("program", WebGLProgram),
          t.param("name", t.string()),
          t.return(t.number())
        )
      ),
      t.property(
        "getBufferParameter",
        t.function(
          t.param("target", t.number()),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getParameter",
        t.function(t.param("pname", t.number()), t.return(t.any()))
      ),
      t.property("getError", t.function(t.return(t.number()))),
      t.property(
        "getFramebufferAttachmentParameter",
        t.function(
          t.param("target", t.number()),
          t.param("attachment", t.number()),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getProgramParameter",
        t.function(
          t.param("program", WebGLProgram),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getProgramInfoLog",
        t.function(
          t.param("program", WebGLProgram),
          t.return(t.nullable(t.string()))
        )
      ),
      t.property(
        "getRenderbufferParameter",
        t.function(
          t.param("target", t.number()),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getShaderParameter",
        t.function(
          t.param("shader", WebGLShader),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getShaderPrecisionFormat",
        t.function(
          t.param("shadertype", t.number()),
          t.param("precisiontype", t.number()),
          t.return(t.nullable(WebGLShaderPrecisionFormat))
        )
      ),
      t.property(
        "getShaderInfoLog",
        t.function(
          t.param("shader", WebGLShader),
          t.return(t.nullable(t.string()))
        )
      ),
      t.property(
        "getShaderSource",
        t.function(
          t.param("shader", WebGLShader),
          t.return(t.nullable(t.string()))
        )
      ),
      t.property(
        "getTexParameter",
        t.function(
          t.param("target", t.number()),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getUniform",
        t.function(
          t.param("program", WebGLProgram),
          t.param("location", WebGLUniformLocation),
          t.return(t.any())
        )
      ),
      t.property(
        "getUniformLocation",
        t.function(
          t.param("program", WebGLProgram),
          t.param("name", t.string()),
          t.return(t.nullable(WebGLUniformLocation))
        )
      ),
      t.property(
        "getVertexAttrib",
        t.function(
          t.param("index", t.number()),
          t.param("pname", t.number()),
          t.return(t.any())
        )
      ),
      t.property(
        "getVertexAttribOffset",
        t.function(
          t.param("index", t.number()),
          t.param("pname", t.number()),
          t.return(t.number())
        )
      ),
      t.property(
        "hint",
        t.function(
          t.param("target", t.number()),
          t.param("mode", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "isBuffer",
        t.function(
          t.param("buffer", t.nullable(WebGLBuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "isEnabled",
        t.function(t.param("cap", t.number()), t.return(t.void()))
      ),
      t.property(
        "isFramebuffer",
        t.function(
          t.param("framebuffer", t.nullable(WebGLFramebuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "isProgram",
        t.function(
          t.param("program", t.nullable(WebGLProgram)),
          t.return(t.void())
        )
      ),
      t.property(
        "isRenderbuffer",
        t.function(
          t.param("renderbuffer", t.nullable(WebGLRenderbuffer)),
          t.return(t.void())
        )
      ),
      t.property(
        "isShader",
        t.function(
          t.param("shader", t.nullable(WebGLShader)),
          t.return(t.void())
        )
      ),
      t.property(
        "isTexture",
        t.function(
          t.param("texture", t.nullable(WebGLTexture)),
          t.return(t.void())
        )
      ),
      t.property(
        "lineWidth",
        t.function(t.param("width", t.number()), t.return(t.void()))
      ),
      t.property(
        "linkProgram",
        t.function(t.param("program", WebGLProgram), t.return(t.void()))
      ),
      t.property(
        "pixelStorei",
        t.function(
          t.param("pname", t.number()),
          t.param("param", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "polygonOffset",
        t.function(
          t.param("factor", t.number()),
          t.param("units", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "readPixels",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.param("format", t.number()),
          t.param("type", t.number()),
          t.param("pixels", t.nullable(t.ref("$ArrayBufferView"))),
          t.return(t.void())
        )
      ),
      t.property(
        "renderbufferStorage",
        t.function(
          t.param("target", t.number()),
          t.param("internalformat", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "sampleCoverage",
        t.function(
          t.param("value", t.number()),
          t.param("invert", t.boolean()),
          t.return(t.void())
        )
      ),
      t.property(
        "scissor",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "shaderSource",
        t.function(
          t.param("shader", WebGLShader),
          t.param("source", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "stencilFunc",
        t.function(
          t.param("func", t.number()),
          t.param("ref", t.number()),
          t.param("mask", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "stencilFuncSeparate",
        t.function(
          t.param("face", t.number()),
          t.param("func", t.number()),
          t.param("ref", t.number()),
          t.param("mask", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "stencilMask",
        t.function(t.param("mask", t.number()), t.return(t.void()))
      ),
      t.property(
        "stencilMaskSeparate",
        t.function(
          t.param("face", t.number()),
          t.param("mask", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "stencilOp",
        t.function(
          t.param("fail", t.number()),
          t.param("zfail", t.number()),
          t.param("zpass", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "stencilOpSeparate",
        t.function(
          t.param("face", t.number()),
          t.param("fail", t.number()),
          t.param("zfail", t.number()),
          t.param("zpass", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "texImage2D",
        t.union(
          t.function(
            t.param("target", t.number()),
            t.param("level", t.number()),
            t.param("internalformat", t.number()),
            t.param("width", t.number()),
            t.param("height", t.number()),
            t.param("border", t.number()),
            t.param("format", t.number()),
            t.param("type", t.number()),
            t.param("pixels", t.nullable(t.ref("$ArrayBufferView"))),
            t.return(t.void())
          ),
          t.function(
            t.param("target", t.number()),
            t.param("level", t.number()),
            t.param("internalformat", t.number()),
            t.param("format", t.number()),
            t.param("type", t.number()),
            t.param("source", TexImageSource),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "texParameterf",
        t.function(
          t.param("target", t.number()),
          t.param("pname", t.number()),
          t.param("param", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "texParameteri",
        t.function(
          t.param("target", t.number()),
          t.param("pname", t.number()),
          t.param("param", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "texSubImage2D",
        t.union(
          t.function(
            t.param("target", t.number()),
            t.param("level", t.number()),
            t.param("xoffset", t.number()),
            t.param("yoffset", t.number()),
            t.param("width", t.number()),
            t.param("height", t.number()),
            t.param("format", t.number()),
            t.param("type", t.number()),
            t.param("pixels", t.nullable(t.ref("$ArrayBufferView"))),
            t.return(t.void())
          ),
          t.function(
            t.param("target", t.number()),
            t.param("level", t.number()),
            t.param("xoffset", t.number()),
            t.param("yoffset", t.number()),
            t.param("format", t.number()),
            t.param("type", t.number()),
            t.param("source", TexImageSource),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform1f",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform1fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform1i",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform1iv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Int32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform2f",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform2fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform2i",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform2iv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Int32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform3f",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform3fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform3i",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform3iv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Int32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform4f",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.param("w", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform4fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniform4i",
        t.function(
          t.param("location", t.nullable(WebGLUniformLocation)),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.param("w", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "uniform4iv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.ref("Int32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("v", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniformMatrix2fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniformMatrix3fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "uniformMatrix4fv",
        t.union(
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.ref("Float32Array")),
            t.return(t.void())
          ),
          t.function(
            t.param("location", t.nullable(WebGLUniformLocation)),
            t.param("transpose", t.boolean()),
            t.param("value", t.array(t.number())),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "useProgram",
        t.function(
          t.param("program", t.nullable(WebGLProgram)),
          t.return(t.void())
        )
      ),
      t.property(
        "validateProgram",
        t.function(t.param("program", WebGLProgram), t.return(t.void()))
      ),
      t.property(
        "vertexAttrib1f",
        t.function(
          t.param("index", t.number()),
          t.param("x", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib1fv",
        t.function(
          t.param("index", t.number()),
          t.param("values", VertexAttribFVSource),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib2f",
        t.function(
          t.param("index", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib2fv",
        t.function(
          t.param("index", t.number()),
          t.param("values", VertexAttribFVSource),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib3f",
        t.function(
          t.param("index", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib3fv",
        t.function(
          t.param("index", t.number()),
          t.param("values", VertexAttribFVSource),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib4f",
        t.function(
          t.param("index", t.number()),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("z", t.number()),
          t.param("w", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttrib4fv",
        t.function(
          t.param("index", t.number()),
          t.param("values", VertexAttribFVSource),
          t.return(t.void())
        )
      ),
      t.property(
        "vertexAttribPointer",
        t.function(
          t.param("index", t.number()),
          t.param("size", t.number()),
          t.param("type", t.number()),
          t.param("normalized", t.boolean()),
          t.param("stride", t.number()),
          t.param("offset", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "viewport",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.param("width", t.number()),
          t.param("height", t.number()),
          t.return(t.void())
        )
      )
    )
  )
);
const RenderingContext = t.type(
  "RenderingContext",
  t.union(t.ref("CanvasRenderingContext2D"), t.ref("WebGLRenderingContext"))
);
t.declare(
  t.class(
    "Blob",
    t.object(
      t.property(
        "constructor",
        t.function(
          t.param("blobParts", t.array(t.any()), true),
          t.param(
            "options",
            t.object(
              t.property("type", t.string(), true),
              t.property("endings", t.string(), true)
            ),
            true
          ),
          t.return(t.void())
        )
      ),
      t.property("isClosed", t.boolean()),
      t.property("size", t.number()),
      t.property("type", t.string()),
      t.property("close", t.function(t.return(t.void()))),
      t.property(
        "slice",
        t.function(
          t.param("start", t.number(), true),
          t.param("end", t.number(), true),
          t.param("contentType", t.string(), true),
          t.return(t.ref("Blob"))
        )
      )
    )
  )
);
t.declare(
  t.class(
    "File",
    t.object(
      t.property("lastModifiedDate", t.any()),
      t.property("name", t.string())
    ),
    t.extends("Blob")
  )
);
t.declare(
  t.class(
    "HTMLCanvasElement",
    t.object(
      t.property("width", t.number()),
      t.property("height", t.number()),
      t.property(
        "getContext",
        t.union(
          t.function(
            t.param("contextId", t.string("2d")),
            t.rest("args", t.any()),
            t.return(t.nullable(t.ref("CanvasRenderingContext2D")))
          ),
          t.function(
            t.param("contextId", t.string("webgl")),
            t.param(
              "contextAttributes",
              t.$shape(WebGLContextAttributes),
              true
            ),
            t.return(t.nullable(t.ref("WebGLRenderingContext")))
          ),
          t.function(
            t.param("contextId", t.string()),
            t.rest("args", t.any()),
            t.return(t.nullable(RenderingContext))
          )
        )
      ),
      t.property(
        "toDataURL",
        t.function(
          t.param("type", t.string(), true),
          t.rest("args", t.any()),
          t.return(t.string())
        )
      ),
      t.property(
        "toBlob",
        t.function(
          t.param(
            "callback",
            t.function(t.param("v", t.ref("File")), t.return(t.void()))
          ),
          t.param("type", t.string(), true),
          t.rest("args", t.any()),
          t.return(t.void())
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(t.class("HTMLDivElement", t.object(), t.extends("HTMLElement")));
t.declare(
  t.class(
    "DOMTokenList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.string())))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.string()))
      ),
      t.property(
        "contains",
        t.function(t.param("token", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "add",
        t.function(t.param("token", t.string()), t.return(t.void()))
      ),
      t.property(
        "remove",
        t.function(t.param("token", t.string()), t.return(t.void()))
      ),
      t.property(
        "toggle",
        t.function(t.param("token", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "forEach",
        t.function(
          t.param(
            "callbackfn",
            t.function(
              t.param("value", t.string()),
              t.param("index", t.number()),
              t.param("list", t.ref("DOMTokenList")),
              t.return(t.any())
            )
          ),
          t.param("thisArg", t.any(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "entries",
        t.function(t.return(t.ref(Iterator, t.tuple(t.number(), t.string()))))
      ),
      t.property("keys", t.function(t.return(t.ref(Iterator, t.number())))),
      t.property("values", t.function(t.return(t.ref(Iterator, t.string()))))
    )
  )
);
t.declare(
  t.class(
    "HTMLIFrameElement",
    t.object(
      t.property("allowFullScreen", t.boolean()),
      t.property("contentDocument", t.ref("Document")),
      t.property("contentWindow", t.any()),
      t.property("frameBorder", t.string()),
      t.property("height", t.string()),
      t.property("marginHeight", t.string()),
      t.property("marginWidth", t.string()),
      t.property("name", t.string()),
      t.property("scrolling", t.string()),
      t.property("sandbox", t.ref("DOMTokenList")),
      t.property("src", t.string()),
      t.property("srcDoc", t.string()),
      t.property("width", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "FileList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("File"))))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.ref("File")))
      ),
      t.indexer("index", t.number(), t.ref("File"))
    )
  )
);
t.declare(
  t.class(
    "HTMLLabelElement",
    t.object(
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("htmlFor", t.string()),
      t.property("control", t.union(t.ref("HTMLElement"), t.null()))
    ),
    t.extends("HTMLElement")
  )
);
const SelectionDirection = t.type(
  "SelectionDirection",
  t.union(t.string("backward"), t.string("forward"), t.string("none"))
);
t.declare(
  t.class(
    "ValidityState",
    t.object(
      t.property("badInput", t.boolean()),
      t.property("customError", t.boolean()),
      t.property("patternMismatch", t.boolean()),
      t.property("rangeOverflow", t.boolean()),
      t.property("rangeUnderflow", t.boolean()),
      t.property("stepMismatch", t.boolean()),
      t.property("tooLong", t.boolean()),
      t.property("typeMismatch", t.boolean()),
      t.property("valueMissing", t.boolean())
    )
  )
);
t.declare(
  t.class(
    "ClientRectList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("ClientRect"))))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.ref("ClientRect")))
      ),
      t.indexer("index", t.number(), t.ref("ClientRect"))
    )
  )
);
t.declare(
  t.class(
    "TextRange",
    t.object(
      t.property("boundingLeft", t.number()),
      t.property("htmlText", t.string()),
      t.property("offsetLeft", t.number()),
      t.property("boundingWidth", t.number()),
      t.property("boundingHeight", t.number()),
      t.property("boundingTop", t.number()),
      t.property("text", t.string()),
      t.property("offsetTop", t.number()),
      t.property(
        "moveToPoint",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "queryCommandValue",
        t.function(t.param("cmdID", t.string()), t.return(t.any()))
      ),
      t.property("getBookmark", t.function(t.return(t.string()))),
      t.property(
        "move",
        t.function(
          t.param("unit", t.string()),
          t.param("count", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "queryCommandIndeterm",
        t.function(t.param("cmdID", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "scrollIntoView",
        t.function(t.param("fStart", t.boolean(), true), t.return(t.void()))
      ),
      t.property(
        "findText",
        t.function(
          t.param("string", t.string()),
          t.param("count", t.number(), true),
          t.param("flags", t.number(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "execCommand",
        t.function(
          t.param("cmdID", t.string()),
          t.param("showUI", t.boolean(), true),
          t.param("value", t.any(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "getBoundingClientRect",
        t.function(t.return(t.ref("ClientRect")))
      ),
      t.property(
        "moveToBookmark",
        t.function(t.param("bookmark", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "isEqual",
        t.function(t.param("range", t.ref("TextRange")), t.return(t.boolean()))
      ),
      t.property("duplicate", t.function(t.return(t.ref("TextRange")))),
      t.property(
        "collapse",
        t.function(t.param("start", t.boolean(), true), t.return(t.void()))
      ),
      t.property(
        "queryCommandText",
        t.function(t.param("cmdID", t.string()), t.return(t.string()))
      ),
      t.property("select", t.function(t.return(t.void()))),
      t.property(
        "pasteHTML",
        t.function(t.param("html", t.string()), t.return(t.void()))
      ),
      t.property(
        "inRange",
        t.function(t.param("range", t.ref("TextRange")), t.return(t.boolean()))
      ),
      t.property(
        "moveEnd",
        t.function(
          t.param("unit", t.string()),
          t.param("count", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property(
        "getClientRects",
        t.function(t.return(t.ref("ClientRectList")))
      ),
      t.property(
        "moveStart",
        t.function(
          t.param("unit", t.string()),
          t.param("count", t.number(), true),
          t.return(t.number())
        )
      ),
      t.property("parentElement", t.function(t.return(t.ref("Element")))),
      t.property(
        "queryCommandState",
        t.function(t.param("cmdID", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "compareEndPoints",
        t.function(
          t.param("how", t.string()),
          t.param("sourceRange", t.ref("TextRange")),
          t.return(t.number())
        )
      ),
      t.property(
        "execCommandShowHelp",
        t.function(t.param("cmdID", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "moveToElementText",
        t.function(t.param("element", t.ref("Element")), t.return(t.void()))
      ),
      t.property(
        "expand",
        t.function(t.param("Unit", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "queryCommandSupported",
        t.function(t.param("cmdID", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "setEndPoint",
        t.function(
          t.param("how", t.string()),
          t.param("SourceRange", t.ref("TextRange")),
          t.return(t.void())
        )
      ),
      t.property(
        "queryCommandEnabled",
        t.function(t.param("cmdID", t.string()), t.return(t.boolean()))
      )
    )
  )
);
const SelectionMode = t.type(
  "SelectionMode",
  t.union(
    t.string("select"),
    t.string("start"),
    t.string("end"),
    t.string("preserve")
  )
);
t.declare(
  t.class(
    "HTMLInputElement",
    t.object(
      t.property("accept", t.string()),
      t.property("align", t.string()),
      t.property("alt", t.string()),
      t.property("autocomplete", t.string()),
      t.property("autofocus", t.boolean()),
      t.property("border", t.string()),
      t.property("checked", t.boolean()),
      t.property("complete", t.boolean()),
      t.property("defaultChecked", t.boolean()),
      t.property("defaultValue", t.string()),
      t.property("dirname", t.string()),
      t.property("disabled", t.boolean()),
      t.property("dynsrc", t.string()),
      t.property("files", t.ref("FileList")),
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("formAction", t.string()),
      t.property("formEncType", t.string()),
      t.property("formMethod", t.string()),
      t.property("formNoValidate", t.boolean()),
      t.property("formTarget", t.string()),
      t.property("height", t.string()),
      t.property("hspace", t.number()),
      t.property("indeterminate", t.boolean()),
      t.property("labels", t.ref("NodeList", t.ref("HTMLLabelElement"))),
      t.property("list", t.union(t.ref("HTMLElement"), t.null())),
      t.property("loop", t.number()),
      t.property("lowsrc", t.string()),
      t.property("max", t.string()),
      t.property("maxLength", t.number()),
      t.property("min", t.string()),
      t.property("multiple", t.boolean()),
      t.property("name", t.string()),
      t.property("pattern", t.string()),
      t.property("placeholder", t.string()),
      t.property("readOnly", t.boolean()),
      t.property("required", t.boolean()),
      t.property("selectionDirection", SelectionDirection),
      t.property("selectionEnd", t.number()),
      t.property("selectionStart", t.number()),
      t.property("size", t.number()),
      t.property("src", t.string()),
      t.property("start", t.string()),
      t.property("status", t.boolean()),
      t.property("step", t.string()),
      t.property("tabIndex", t.number()),
      t.property("type", t.string()),
      t.property("useMap", t.string()),
      t.property("validationMessage", t.string()),
      t.property("validity", t.ref("ValidityState")),
      t.property("value", t.string()),
      t.property("valueAsDate", t.ref("Date")),
      t.property("valueAsNumber", t.number()),
      t.property("vrml", t.string()),
      t.property("vspace", t.number()),
      t.property("width", t.string()),
      t.property("willValidate", t.boolean()),
      t.property("blur", t.function(t.return(t.void()))),
      t.property("checkValidity", t.function(t.return(t.boolean()))),
      t.property(
        "setCustomValidity",
        t.function(t.param("error", t.string()), t.return(t.void()))
      ),
      t.property("click", t.function(t.return(t.void()))),
      t.property("createTextRange", t.function(t.return(t.ref("TextRange")))),
      t.property("focus", t.function(t.return(t.void()))),
      t.property("select", t.function(t.return(t.void()))),
      t.property(
        "setRangeText",
        t.union(
          t.function(
            t.param("replacement", t.string()),
            t.param("start", t.void(), true),
            t.param("end", t.void(), true),
            t.param("selectMode", t.void(), true),
            t.return(t.void())
          ),
          t.function(
            t.param("replacement", t.string()),
            t.param("start", t.number()),
            t.param("end", t.number()),
            t.param("selectMode", SelectionMode, true),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "setSelectionRange",
        t.function(
          t.param("start", t.number()),
          t.param("end", t.number()),
          t.param("direction", SelectionDirection, true),
          t.return(t.void())
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLLinkElement",
    t.object(
      t.property(
        "crossOrigin",
        t.nullable(t.union(t.string("anonymous"), t.string("use-credentials")))
      ),
      t.property("href", t.string()),
      t.property("hreflang", t.string()),
      t.property("media", t.string()),
      t.property("rel", t.string()),
      t.property("sizes", t.ref("DOMTokenList")),
      t.property("type", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLMetaElement",
    t.object(
      t.property("content", t.string()),
      t.property("httpEquiv", t.string()),
      t.property("name", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLOptionElement",
    t.object(
      t.property("defaultSelected", t.boolean()),
      t.property("disabled", t.boolean()),
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("index", t.number()),
      t.property("label", t.string()),
      t.property("selected", t.boolean()),
      t.property("text", t.string()),
      t.property("value", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLParagraphElement",
    t.object(
      t.property(
        "align",
        t.union(
          t.string("left"),
          t.string("center"),
          t.string("right"),
          t.string("justify")
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLScriptElement",
    t.object(
      t.property("async", t.boolean()),
      t.property("charset", t.string()),
      t.property("crossOrigin", t.string(), true),
      t.property("defer", t.boolean()),
      t.property("src", t.string()),
      t.property("text", t.string()),
      t.property("type", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLOptionsCollection",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("Node"))))
      ),
      t.property("length", t.number()),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.ref("Node")))
      ),
      t.property(
        "namedItem",
        t.function(t.param("name", t.string()), t.return(t.ref("Node")))
      )
    )
  )
);
t.declare(
  t.class(
    "HTMLSelectElement",
    t.object(
      t.property("disabled", t.boolean()),
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("length", t.number()),
      t.property("multiple", t.boolean()),
      t.property("name", t.string()),
      t.property("options", t.ref("HTMLOptionsCollection")),
      t.property("selectedIndex", t.number()),
      t.property("size", t.number()),
      t.property("type", t.string()),
      t.property("value", t.string()),
      t.property(
        "add",
        t.function(
          t.param("element", t.ref("HTMLElement")),
          t.param("before", t.ref("HTMLElement"), true),
          t.return(t.void())
        )
      ),
      t.property("checkValidity", t.function(t.return(t.boolean()))),
      t.property(
        "remove",
        t.function(t.param("index", t.number(), true), t.return(t.void()))
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLSourceElement",
    t.object(
      t.property("src", t.string()),
      t.property("type", t.string()),
      t.property("srcset", t.string()),
      t.property("sizes", t.string()),
      t.property("media", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(t.class("HTMLSpanElement", t.object(), t.extends("HTMLElement")));
t.declare(
  t.class(
    "HTMLStyleElement",
    t.object(
      t.property("disabled", t.boolean()),
      t.property("media", t.string()),
      t.property("scoped", t.nullable(t.boolean())),
      t.property("sheet", t.nullable(t.ref("StyleSheet"))),
      t.property("type", t.string())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLTextAreaElement",
    t.object(
      t.property("autofocus", t.boolean()),
      t.property("cols", t.number()),
      t.property("dirName", t.string()),
      t.property("disabled", t.boolean()),
      t.property("form", t.union(t.ref("HTMLFormElement"), t.null())),
      t.property("maxLength", t.number()),
      t.property("name", t.string()),
      t.property("placeholder", t.string()),
      t.property("readOnly", t.boolean()),
      t.property("required", t.boolean()),
      t.property("rows", t.number()),
      t.property("wrap", t.string()),
      t.property("type", t.string()),
      t.property("defaultValue", t.string()),
      t.property("value", t.string()),
      t.property("textLength", t.number()),
      t.property("willValidate", t.boolean()),
      t.property("validity", t.ref("ValidityState")),
      t.property("validationMessage", t.string()),
      t.property("checkValidity", t.function(t.return(t.boolean()))),
      t.property(
        "setCustomValidity",
        t.function(t.param("error", t.string()), t.return(t.void()))
      ),
      t.property("labels", t.ref("NodeList", t.ref("HTMLLabelElement"))),
      t.property("select", t.function(t.return(t.void()))),
      t.property("selectionStart", t.number()),
      t.property("selectionEnd", t.number()),
      t.property("selectionDirection", SelectionDirection),
      t.property(
        "setSelectionRange",
        t.function(
          t.param("start", t.number()),
          t.param("end", t.number()),
          t.param("direction", SelectionDirection, true),
          t.return(t.void())
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class("HTMLTableCaptionElement", t.object(), t.extends("HTMLElement"))
);
t.declare(
  t.class(
    "HTMLTableCellElement",
    t.object(
      t.property("colSpan", t.number()),
      t.property("rowSpan", t.number()),
      t.property("cellIndex", t.number())
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLTableRowElement",
    t.object(
      t.property(
        "align",
        t.union(t.string("left"), t.string("right"), t.string("center"))
      ),
      t.property("rowIndex", t.number()),
      t.property(
        "deleteCell",
        t.function(t.param("index", t.number()), t.return(t.void()))
      ),
      t.property(
        "insertCell",
        t.function(
          t.param("index", t.number()),
          t.return(t.ref("HTMLTableCellElement"))
        )
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLTableSectionElement",
    t.object(
      t.property("rows", t.ref("HTMLCollection", t.ref("HTMLTableRowElement")))
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "HTMLTableElement",
    t.object(
      t.property("caption", t.ref("HTMLTableCaptionElement")),
      t.property("tHead", t.ref("HTMLTableSectionElement")),
      t.property("tFoot", t.ref("HTMLTableSectionElement")),
      t.property(
        "tBodies",
        t.ref("HTMLCollection", t.ref("HTMLTableSectionElement"))
      ),
      t.property("rows", t.ref("HTMLCollection", t.ref("HTMLTableRowElement"))),
      t.property(
        "createTHead",
        t.function(t.return(t.ref("HTMLTableSectionElement")))
      ),
      t.property("deleteTHead", t.function(t.return(t.void()))),
      t.property(
        "createTFoot",
        t.function(t.return(t.ref("HTMLTableSectionElement")))
      ),
      t.property("deleteTFoot", t.function(t.return(t.void()))),
      t.property(
        "createCaption",
        t.function(t.return(t.ref("HTMLTableCaptionElement")))
      ),
      t.property("deleteCaption", t.function(t.return(t.void()))),
      t.property(
        "insertRow",
        t.function(
          t.param("index", t.nullable(t.number())),
          t.return(t.ref("HTMLTableRowElement"))
        )
      ),
      t.property(
        "deleteRow",
        t.function(t.param("index", t.number()), t.return(t.void()))
      )
    ),
    t.extends("HTMLElement")
  )
);
t.declare(
  t.class(
    "NamedNodeMap",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("Attr"))))
      ),
      t.property("length", t.number()),
      t.property(
        "removeNamedItemNS",
        t.function(
          t.param("namespaceURI", t.string()),
          t.param("localName", t.string()),
          t.return(t.ref("Attr"))
        )
      ),
      t.property(
        "item",
        t.function(t.param("index", t.number()), t.return(t.ref("Attr")))
      ),
      t.property(
        "removeNamedItem",
        t.function(t.param("name", t.string()), t.return(t.ref("Attr")))
      ),
      t.property(
        "getNamedItem",
        t.function(t.param("name", t.string()), t.return(t.ref("Attr")))
      ),
      t.property(
        "setNamedItem",
        t.function(t.param("arg", t.ref("Attr")), t.return(t.ref("Attr")))
      ),
      t.property(
        "getNamedItemNS",
        t.function(
          t.param("namespaceURI", t.string()),
          t.param("localName", t.string()),
          t.return(t.ref("Attr"))
        )
      ),
      t.property(
        "setNamedItemNS",
        t.function(t.param("arg", t.ref("Attr")), t.return(t.ref("Attr")))
      ),
      t.indexer("index", t.number(), t.ref("Attr"))
    )
  )
);
t.declare(
  t.class(
    "DocumentType",
    t.object(
      t.property("name", t.string()),
      t.property("notations", t.ref("NamedNodeMap")),
      t.property("systemId", t.string()),
      t.property("internalSubset", t.string()),
      t.property("entities", t.ref("NamedNodeMap")),
      t.property("publicId", t.string())
    ),
    t.extends("Node")
  )
);
t.declare(t.class("HTMLEmbedElement", t.object(), t.extends("HTMLElement")));
t.declare(
  t.class(
    "DOMImplementation",
    t.object(
      t.property(
        "createDocumentType",
        t.function(
          t.param("qualifiedName", t.string()),
          t.param("publicId", t.string()),
          t.param("systemId", t.string()),
          t.return(t.ref("DocumentType"))
        )
      ),
      t.property(
        "createDocument",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("qualifiedName", t.string()),
          t.param("doctype", t.union(t.ref("DocumentType"), t.null()), true),
          t.return(t.ref("Document"))
        )
      ),
      t.property(
        "hasFeature",
        t.function(
          t.param("feature", t.string()),
          t.param("version", t.string(), true),
          t.return(t.boolean())
        )
      ),
      t.property(
        "createHTMLDocument",
        t.function(
          t.param("title", t.string(), true),
          t.return(t.ref("Document"))
        )
      )
    )
  )
);
t.declare(
  t.class(
    "StyleSheetList",
    t.object(
      t.property(
        Symbol.iterator,
        t.function(t.return(t.ref(Iterator, t.ref("StyleSheet"))))
      ),
      t.property("length", t.number()),
      t.indexer("index", t.number(), t.ref("StyleSheet"))
    )
  )
);
const ElementRegistrationOptions = t.type(
  "ElementRegistrationOptions",
  t.object(
    t.property(
      "prototype",
      t.object(
        t.property("createdCallback", t.function(t.return(t.mixed())), true),
        t.property("attachedCallback", t.function(t.return(t.mixed())), true),
        t.property("detachedCallback", t.function(t.return(t.mixed())), true),
        t.property(
          "attributeChangedCallback",
          t.intersection(
            t.function(
              t.param("attributeLocalName", t.string()),
              t.param("oldAttributeValue", t.null()),
              t.param("newAttributeValue", t.string()),
              t.param("attributeNamespace", t.string()),
              t.return(t.mixed())
            ),
            t.function(
              t.param("attributeLocalName", t.string()),
              t.param("oldAttributeValue", t.string()),
              t.param("newAttributeValue", t.string()),
              t.param("attributeNamespace", t.string()),
              t.return(t.mixed())
            ),
            t.function(
              t.param("attributeLocalName", t.string()),
              t.param("oldAttributeValue", t.string()),
              t.param("newAttributeValue", t.null()),
              t.param("attributeNamespace", t.string()),
              t.return(t.mixed())
            )
          ),
          true
        )
      ),
      true
    ),
    t.property("extends", t.string(), true)
  )
);
t.declare(
  t.class(
    "Range",
    t.object(
      t.property("startOffset", t.number()),
      t.property("collapsed", t.boolean()),
      t.property("endOffset", t.number()),
      t.property("startContainer", t.ref("Node")),
      t.property("endContainer", t.ref("Node")),
      t.property("commonAncestorContainer", t.ref("Node")),
      t.property(
        "setStart",
        t.function(
          t.param("refNode", t.ref("Node")),
          t.param("offset", t.number()),
          t.return(t.void())
        )
      ),
      t.property(
        "setEndBefore",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "setStartBefore",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "selectNode",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property("detach", t.function(t.return(t.void()))),
      t.property(
        "getBoundingClientRect",
        t.function(t.return(t.ref("ClientRect")))
      ),
      t.property("toString", t.function(t.return(t.string()))),
      t.property(
        "compareBoundaryPoints",
        t.function(
          t.param("how", t.number()),
          t.param("sourceRange", t.ref("Range")),
          t.return(t.number())
        )
      ),
      t.property(
        "insertNode",
        t.function(t.param("newNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "collapse",
        t.function(t.param("toStart", t.boolean()), t.return(t.void()))
      ),
      t.property(
        "selectNodeContents",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "cloneContents",
        t.function(t.return(t.ref("DocumentFragment")))
      ),
      t.property(
        "setEnd",
        t.function(
          t.param("refNode", t.ref("Node")),
          t.param("offset", t.number()),
          t.return(t.void())
        )
      ),
      t.property("cloneRange", t.function(t.return(t.ref("Range")))),
      t.property(
        "getClientRects",
        t.function(t.return(t.ref("ClientRectList")))
      ),
      t.property(
        "surroundContents",
        t.function(t.param("newParent", t.ref("Node")), t.return(t.void()))
      ),
      t.property("deleteContents", t.function(t.return(t.void()))),
      t.property(
        "setStartAfter",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "extractContents",
        t.function(t.return(t.ref("DocumentFragment")))
      ),
      t.property(
        "setEndAfter",
        t.function(t.param("refNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "createContextualFragment",
        t.function(t.param("fragment", t.string()), t.return(t.ref("Node")))
      ),
      t.property("END_TO_END", t.number()),
      t.property("START_TO_START", t.number()),
      t.property("START_TO_END", t.number()),
      t.property("END_TO_START", t.number())
    )
  )
);
t.declare(
  t.class(
    "Selection",
    t.object(
      t.property("anchorNode", t.union(t.ref("Node"), t.null())),
      t.property("anchorOffset", t.number()),
      t.property("focusNode", t.union(t.ref("Node"), t.null())),
      t.property("focusOffset", t.number()),
      t.property("isCollapsed", t.boolean()),
      t.property("rangeCount", t.number()),
      t.property("type", t.string()),
      t.property(
        "addRange",
        t.function(t.param("range", t.ref("Range")), t.return(t.void()))
      ),
      t.property(
        "getRangeAt",
        t.function(t.param("index", t.number()), t.return(t.ref("Range")))
      ),
      t.property(
        "removeRange",
        t.function(t.param("range", t.ref("Range")), t.return(t.void()))
      ),
      t.property("removeAllRanges", t.function(t.return(t.void()))),
      t.property(
        "collapse",
        t.function(
          t.param("parentNode", t.union(t.ref("Node"), t.null())),
          t.param("offset", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property("collapseToStart", t.function(t.return(t.void()))),
      t.property("collapseToEnd", t.function(t.return(t.void()))),
      t.property(
        "containsNode",
        t.function(
          t.param("aNode", t.ref("Node")),
          t.param("aPartlyContained", t.boolean(), true),
          t.return(t.boolean())
        )
      ),
      t.property("deleteFromDocument", t.function(t.return(t.void()))),
      t.property(
        "extend",
        t.function(
          t.param("parentNode", t.ref("Node")),
          t.param("offset", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property("empty", t.function(t.return(t.void()))),
      t.property(
        "selectAllChildren",
        t.function(t.param("parentNode", t.ref("Node")), t.return(t.void()))
      ),
      t.property(
        "setPosition",
        t.function(
          t.param("aNode", t.union(t.ref("Node"), t.null())),
          t.param("offset", t.number(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "setBaseAndExtent",
        t.function(
          t.param("anchorNode", t.ref("Node")),
          t.param("anchorOffset", t.number()),
          t.param("focusNode", t.ref("Node")),
          t.param("focusOffset", t.number()),
          t.return(t.void())
        )
      ),
      t.property("toString", t.function(t.return(t.string())))
    )
  )
);
t.declare(
  t.class(
    "Location",
    t.object(
      t.property("ancestorOrigins", t.array(t.string())),
      t.property("hash", t.string()),
      t.property("host", t.string()),
      t.property("hostname", t.string()),
      t.property("href", t.string()),
      t.property("origin", t.string()),
      t.property("pathname", t.string()),
      t.property("port", t.string()),
      t.property("protocol", t.string()),
      t.property("search", t.string()),
      t.property(
        "assign",
        t.function(t.param("url", t.string()), t.return(t.void()))
      ),
      t.property(
        "reload",
        t.function(t.param("flag", t.boolean(), true), t.return(t.void()))
      ),
      t.property(
        "replace",
        t.function(t.param("url", t.string()), t.return(t.void()))
      ),
      t.property("toString", t.function(t.return(t.string())))
    )
  )
);
const CustomEvent$Init = t.type(
  "CustomEvent$Init",
  t.intersection(Event$Init, t.object(t.property("detail", t.any(), true)))
);
t.declare(
  t.class(
    "CustomEvent",
    t.object(
      t.property(
        "constructor",
        t.function(
          t.param("type", t.string()),
          t.param("eventInitDict", CustomEvent$Init, true),
          t.return(t.void())
        )
      ),
      t.property("detail", t.any())
    ),
    t.extends("Event")
  )
);
t.declare(
  t.class(
    "NodeFilter",
    t.object(
      t.staticProperty("SHOW_ALL", t.number(-1)),
      t.staticProperty("SHOW_ELEMENT", t.number(1)),
      t.staticProperty("SHOW_ATTRIBUTE", t.number(2)),
      t.staticProperty("SHOW_TEXT", t.number(4)),
      t.staticProperty("SHOW_CDATA_SECTION", t.number(8)),
      t.staticProperty("SHOW_ENTITY_REFERENCE", t.number(16)),
      t.staticProperty("SHOW_ENTITY", t.number(32)),
      t.staticProperty("SHOW_PROCESSING_INSTRUCTION", t.number(64)),
      t.staticProperty("SHOW_COMMENT", t.number(128)),
      t.staticProperty("SHOW_DOCUMENT", t.number(256)),
      t.staticProperty("SHOW_DOCUMENT_TYPE", t.number(512)),
      t.staticProperty("SHOW_DOCUMENT_FRAGMENT", t.number(1024)),
      t.staticProperty("SHOW_NOTATION", t.number(2048)),
      t.staticProperty("FILTER_ACCEPT", t.number(1)),
      t.staticProperty("FILTER_REJECT", t.number(2)),
      t.staticProperty("FILTER_SKIP", t.number(3)),
      t.property("acceptNode", t.tdz(() => NodeFilterCallback)) // eslint-disable-line
    )
  )
);
const NodeFilterCallback = t.type(
  "NodeFilterCallback",
  t.function(
    t.param("node", t.ref("Node")),
    t.return(
      t.union(
        t.get("NodeFilter", "FILTER_ACCEPT"),
        t.get("NodeFilter", "FILTER_REJECT"),
        t.get("NodeFilter", "FILTER_SKIP")
      )
    )
  )
);
const NodeFilterInterface = t.type(
  "NodeFilterInterface",
  t.union(
    NodeFilterCallback,
    t.object(t.property("acceptNode", NodeFilterCallback))
  )
);
t.declare(
  t.class("NodeIterator", _NodeIterator => {
    const RootNodeT = _NodeIterator.typeParameter("RootNodeT"),
      WhatToShowT = _NodeIterator.typeParameter("WhatToShowT");

    return [
      t.object(
        t.property("root", RootNodeT),
        t.property("whatToShow", t.number()),
        t.property("filter", t.ref("NodeFilter")),
        t.property("expandEntityReferences", t.boolean()),
        t.property("referenceNode", t.union(RootNodeT, WhatToShowT)),
        t.property("pointerBeforeReferenceNode", t.boolean()),
        t.property("detach", t.function(t.return(t.void()))),
        t.property(
          "previousNode",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "nextNode",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        )
      )
    ];
  })
);
t.declare(
  t.class("TreeWalker", _TreeWalker => {
    const RootNodeT = _TreeWalker.typeParameter("RootNodeT"),
      WhatToShowT = _TreeWalker.typeParameter("WhatToShowT");

    return [
      t.object(
        t.property("root", RootNodeT),
        t.property("whatToShow", t.number()),
        t.property("filter", t.ref("NodeFilter")),
        t.property("expandEntityReferences", t.boolean()),
        t.property("currentNode", t.union(RootNodeT, WhatToShowT)),
        t.property(
          "parentNode",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "firstChild",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "lastChild",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "previousSibling",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "nextSibling",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "previousNode",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        ),
        t.property(
          "nextNode",
          t.function(t.return(t.union(WhatToShowT, t.null())))
        )
      )
    ];
  })
);
t.declare(
  t.class(
    "Document",
    t.object(
      t.property("URL", t.string()),
      t.property(
        "adoptNode",
        t.function(_fn17 => {
          const T = _fn17.typeParameter("T", t.ref("Node"));

          return [ t.param("source", T), t.return(T) ];
        })
      ),
      t.property(
        "anchors",
        t.ref("HTMLCollection", t.ref("HTMLAnchorElement"))
      ),
      t.property(
        "applets",
        t.ref("HTMLCollection", t.ref("HTMLAppletElement"))
      ),
      t.property("body", t.union(t.ref("HTMLElement"), t.null())),
      t.property("characterSet", t.string()),
      t.property("close", t.function(t.return(t.void()))),
      t.property("cookie", t.string()),
      t.property(
        "createAttribute",
        t.function(t.param("name", t.string()), t.return(t.ref("Attr")))
      ),
      t.property(
        "createAttributeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("qualifiedName", t.string()),
          t.return(t.ref("Attr"))
        )
      ),
      t.property(
        "createCDATASection",
        t.function(t.param("data", t.string()), t.return(t.ref("Text")))
      ),
      t.property(
        "createComment",
        t.function(t.param("data", t.string()), t.return(t.ref("Comment")))
      ),
      t.property(
        "createDocumentFragment",
        t.function(t.return(t.ref("DocumentFragment")))
      ),
      t.property(
        "createElement",
        t.union(
          t.function(
            t.param("tagName", t.string("a")),
            t.return(t.ref("HTMLAnchorElement"))
          ),
          t.function(
            t.param("tagName", t.string("audio")),
            t.return(t.ref("HTMLAudioElement"))
          ),
          t.function(
            t.param("tagName", t.string("button")),
            t.return(t.ref("HTMLButtonElement"))
          ),
          t.function(
            t.param("tagName", t.string("canvas")),
            t.return(t.ref("HTMLCanvasElement"))
          ),
          t.function(
            t.param("tagName", t.string("div")),
            t.return(t.ref("HTMLDivElement"))
          ),
          t.function(
            t.param("tagName", t.string("form")),
            t.return(t.ref("HTMLFormElement"))
          ),
          t.function(
            t.param("tagName", t.string("iframe")),
            t.return(t.ref("HTMLIFrameElement"))
          ),
          t.function(
            t.param("tagName", t.string("img")),
            t.return(t.ref("HTMLImageElement"))
          ),
          t.function(
            t.param("tagName", t.string("input")),
            t.return(t.ref("HTMLInputElement"))
          ),
          t.function(
            t.param("tagName", t.string("label")),
            t.return(t.ref("HTMLLabelElement"))
          ),
          t.function(
            t.param("tagName", t.string("link")),
            t.return(t.ref("HTMLLinkElement"))
          ),
          t.function(
            t.param("tagName", t.string("media")),
            t.return(t.ref("HTMLMediaElement"))
          ),
          t.function(
            t.param("tagName", t.string("meta")),
            t.return(t.ref("HTMLMetaElement"))
          ),
          t.function(
            t.param("tagName", t.string("option")),
            t.return(t.ref("HTMLOptionElement"))
          ),
          t.function(
            t.param("tagName", t.string("p")),
            t.return(t.ref("HTMLParagraphElement"))
          ),
          t.function(
            t.param("tagName", t.string("script")),
            t.return(t.ref("HTMLScriptElement"))
          ),
          t.function(
            t.param("tagName", t.string("select")),
            t.return(t.ref("HTMLSelectElement"))
          ),
          t.function(
            t.param("tagName", t.string("source")),
            t.return(t.ref("HTMLSourceElement"))
          ),
          t.function(
            t.param("tagName", t.string("span")),
            t.return(t.ref("HTMLSpanElement"))
          ),
          t.function(
            t.param("tagName", t.string("style")),
            t.return(t.ref("HTMLStyleElement"))
          ),
          t.function(
            t.param("tagName", t.string("textarea")),
            t.return(t.ref("HTMLTextAreaElement"))
          ),
          t.function(
            t.param("tagName", t.string("video")),
            t.return(t.ref("HTMLVideoElement"))
          ),
          t.function(
            t.param("tagName", t.string("table")),
            t.return(t.ref("HTMLTableElement"))
          ),
          t.function(
            t.param("tagName", t.string("caption")),
            t.return(t.ref("HTMLTableCaptionElement"))
          ),
          t.function(
            t.param("tagName", t.union(t.string("thead"), t.string("tfoot"))),
            t.param("_arg1", t.string("tbody")),
            t.return(t.ref("HTMLTableSectionElement"))
          ),
          t.function(
            t.param("tagName", t.string("tr")),
            t.return(t.ref("HTMLTableRowElement"))
          ),
          t.function(
            t.param("tagName", t.union(t.string("td"), t.string("th"))),
            t.return(t.ref("HTMLTableCellElement"))
          ),
          t.function(
            t.param("tagName", t.string()),
            t.return(t.ref("HTMLElement"))
          )
        )
      ),
      t.property(
        "createElementNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("qualifiedName", t.string()),
          t.return(t.ref("Element"))
        )
      ),
      t.property(
        "createTextNode",
        t.function(t.param("data", t.string()), t.return(t.ref("Text")))
      ),
      t.property(
        "currentScript",
        t.union(t.ref("HTMLScriptElement"), t.null())
      ),
      t.property("doctype", t.union(t.ref("DocumentType"), t.null())),
      t.property("documentElement", t.union(t.ref("HTMLElement"), t.null())),
      t.property("documentMode", t.number()),
      t.property("domain", t.union(t.string(), t.null())),
      t.property("embeds", t.ref("HTMLCollection", t.ref("HTMLEmbedElement"))),
      t.property(
        "execCommand",
        t.function(
          t.param("cmdID", t.string()),
          t.param("showUI", t.boolean(), true),
          t.param("value", t.any(), true),
          t.return(t.boolean())
        )
      ),
      t.property("forms", t.ref("HTMLCollection", t.ref("HTMLFormElement"))),
      t.property(
        "getElementById",
        t.function(
          t.param("elementId", t.string()),
          t.return(t.union(t.ref("HTMLElement"), t.null()))
        )
      ),
      t.property(
        "getElementsByClassName",
        t.function(
          t.param("classNames", t.string()),
          t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
        )
      ),
      t.property(
        "getElementsByName",
        t.function(
          t.param("elementName", t.string()),
          t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
        )
      ),
      t.property(
        "getElementsByTagName",
        t.union(
          t.function(
            t.param("name", t.string("a")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAnchorElement")))
          ),
          t.function(
            t.param("name", t.string("audio")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAudioElement")))
          ),
          t.function(
            t.param("name", t.string("button")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLButtonElement")))
          ),
          t.function(
            t.param("name", t.string("canvas")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLCanvasElement")))
          ),
          t.function(
            t.param("name", t.string("div")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLDivElement")))
          ),
          t.function(
            t.param("name", t.string("form")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLFormElement")))
          ),
          t.function(
            t.param("name", t.string("iframe")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLIFrameElement")))
          ),
          t.function(
            t.param("name", t.string("img")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLImageElement")))
          ),
          t.function(
            t.param("name", t.string("input")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLInputElement")))
          ),
          t.function(
            t.param("name", t.string("label")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLabelElement")))
          ),
          t.function(
            t.param("name", t.string("link")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLinkElement")))
          ),
          t.function(
            t.param("name", t.string("media")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMediaElement")))
          ),
          t.function(
            t.param("name", t.string("meta")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMetaElement")))
          ),
          t.function(
            t.param("name", t.string("option")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLOptionElement")))
          ),
          t.function(
            t.param("name", t.string("p")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLParagraphElement")))
          ),
          t.function(
            t.param("name", t.string("script")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLScriptElement")))
          ),
          t.function(
            t.param("name", t.string("select")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSelectElement")))
          ),
          t.function(
            t.param("name", t.string("source")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSourceElement")))
          ),
          t.function(
            t.param("name", t.string("span")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSpanElement")))
          ),
          t.function(
            t.param("name", t.string("style")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLStyleElement")))
          ),
          t.function(
            t.param("name", t.string("textarea")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTextAreaElement")))
          ),
          t.function(
            t.param("name", t.string("video")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLVideoElement")))
          ),
          t.function(
            t.param("name", t.string("table")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableElement")))
          ),
          t.function(
            t.param("name", t.string("caption")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCaptionElement")))
          ),
          t.function(
            t.param(
              "name",
              t.union(t.string("thead"), t.string("tfoot"), t.string("tbody"))
            ),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableSectionElement")))
          ),
          t.function(
            t.param("name", t.string("tr")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableRowElement")))
          ),
          t.function(
            t.param("name", t.union(t.string("td"), t.string("th"))),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCellElement")))
          ),
          t.function(
            t.param("name", t.string()),
            t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
          )
        )
      ),
      t.property(
        "getElementsByTagNameNS",
        t.union(
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("a")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAnchorElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("audio")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAudioElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("button")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLButtonElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("canvas")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLCanvasElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("div")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLDivElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("form")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLFormElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("iframe")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLIFrameElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("img")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLImageElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("input")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLInputElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("label")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLabelElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("link")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLinkElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("media")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMediaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("meta")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMetaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("option")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLOptionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("p")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLParagraphElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("script")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLScriptElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("select")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSelectElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("source")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSourceElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("span")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSpanElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("style")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLStyleElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("textarea")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTextAreaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("video")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLVideoElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("table")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("caption")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCaptionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param(
              "localName",
              t.union(t.string("thead"), t.string("tfoot"), t.string("tbody"))
            ),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableSectionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("tr")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableRowElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.union(t.string("td"), t.string("th"))),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCellElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string()),
            t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
          )
        )
      ),
      t.property("head", t.union(t.ref("HTMLElement"), t.null())),
      t.property("images", t.ref("HTMLCollection", t.ref("HTMLImageElement"))),
      t.property("implementation", t.ref("DOMImplementation")),
      t.property(
        "importNode",
        t.function(_fn18 => {
          const T = _fn18.typeParameter("T", t.ref("Node"));

          return [
            t.param("importedNode", T),
            t.param("deep", t.boolean()),
            t.return(T)
          ];
        })
      ),
      t.property("inputEncoding", t.string()),
      t.property("lastModified", t.string()),
      t.property("links", t.ref("HTMLCollection", t.ref("HTMLLinkElement"))),
      t.property("media", t.string()),
      t.property(
        "open",
        t.function(
          t.param("url", t.string(), true),
          t.param("name", t.string(), true),
          t.param("features", t.string(), true),
          t.param("replace", t.boolean(), true),
          t.return(t.any())
        )
      ),
      t.property("readyState", t.string()),
      t.property("referrer", t.string()),
      t.property(
        "scripts",
        t.ref("HTMLCollection", t.ref("HTMLScriptElement"))
      ),
      t.property("styleSheets", t.ref("StyleSheetList")),
      t.property("title", t.string()),
      t.property(
        "visibilityState",
        t.union(
          t.string("visible"),
          t.string("hidden"),
          t.string("prerender"),
          t.string("unloaded")
        )
      ),
      t.property(
        "write",
        t.function(t.rest("content", t.array(t.string())), t.return(t.void()))
      ),
      t.property(
        "writeln",
        t.function(t.rest("content", t.array(t.string())), t.return(t.void()))
      ),
      t.property("xmlEncoding", t.string()),
      t.property("xmlStandalone", t.boolean()),
      t.property("xmlVersion", t.string()),
      t.property(
        "registerElement",
        t.function(
          t.param("type", t.string()),
          t.param("options", ElementRegistrationOptions, true),
          t.return(t.any())
        )
      ),
      t.property(
        "getSelection",
        t.function(t.return(t.union(t.ref("Selection"), t.null())))
      ),
      t.property("activeElement", t.union(t.ref("HTMLElement"), t.null())),
      t.property("hasFocus", t.function(t.return(t.boolean()))),
      t.property("location", t.ref("Location")),
      t.property(
        "createEvent",
        t.union(
          t.function(
            t.param("eventInterface", t.string("CustomEvent")),
            t.return(t.ref("CustomEvent"))
          ),
          t.function(
            t.param("eventInterface", t.string()),
            t.return(t.ref("Event"))
          )
        )
      ),
      t.property("createRange", t.function(t.return(t.ref("Range")))),
      t.property(
        "elementFromPoint",
        t.function(
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.ref("HTMLElement"))
        )
      ),
      t.property("defaultView", t.any()),
      t.property(
        "compatMode",
        t.union(t.string("BackCompat"), t.string("CSS1Compat"))
      ),
      t.property("hidden", t.boolean()),
      t.property("childElementCount", t.number()),
      t.property("children", t.ref("HTMLCollection", t.ref("HTMLElement"))),
      t.property("firstElementChild", t.nullable(t.ref("Element"))),
      t.property("lastElementChild", t.nullable(t.ref("Element"))),
      t.property(
        "querySelector",
        t.function(
          t.param("selector", t.string()),
          t.return(t.union(t.ref("HTMLElement"), t.null()))
        )
      ),
      t.property(
        "querySelectorAll",
        t.function(
          t.param("selector", t.string()),
          t.return(t.ref("NodeList", t.ref("HTMLElement")))
        )
      ),
      t.property(
        "createNodeIterator",
        t.union(
          t.function(_fn19 => {
            const RootNodeT = _fn19.typeParameter("RootNodeT", t.ref("Attr"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(2)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Attr")))
            ];
          }),
          t.function(_fn20 => {
            const RootNodeT = _fn20.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(256)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Document")))
            ];
          }),
          t.function(_fn21 => {
            const RootNodeT = _fn21.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(257)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn22 => {
            const RootNodeT = _fn22.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(260)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn23 => {
            const RootNodeT = _fn23.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(261)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn24 => {
            const RootNodeT = _fn24.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(384)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn25 => {
            const RootNodeT = _fn25.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(385)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn26 => {
            const RootNodeT = _fn26.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(388)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Text"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn27 => {
            const RootNodeT = _fn27.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(389)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn28 => {
            const RootNodeT = _fn28.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(512)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("DocumentType")))
            ];
          }),
          t.function(_fn29 => {
            const RootNodeT = _fn29.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(513)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn30 => {
            const RootNodeT = _fn30.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(516)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn31 => {
            const RootNodeT = _fn31.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(517)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn32 => {
            const RootNodeT = _fn32.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(640)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn33 => {
            const RootNodeT = _fn33.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(641)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn34 => {
            const RootNodeT = _fn34.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(644)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn35 => {
            const RootNodeT = _fn35.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(645)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn36 => {
            const RootNodeT = _fn36.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(768)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Document"))
                )
              )
            ];
          }),
          t.function(_fn37 => {
            const RootNodeT = _fn37.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(769)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element")
                  )
                )
              )
            ];
          }),
          t.function(_fn38 => {
            const RootNodeT = _fn38.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(772)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn39 => {
            const RootNodeT = _fn39.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(773)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn40 => {
            const RootNodeT = _fn40.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(896)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn41 => {
            const RootNodeT = _fn41.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(897)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn42 => {
            const RootNodeT = _fn42.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(900)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn43 => {
            const RootNodeT = _fn43.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(901)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn44 => {
            const RootNodeT = _fn44.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1024)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref("NodeIterator", RootNodeT, t.ref("DocumentFragment"))
              )
            ];
          }),
          t.function(_fn45 => {
            const RootNodeT = _fn45.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1025)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn46 => {
            const RootNodeT = _fn46.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1028)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn47 => {
            const RootNodeT = _fn47.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1029)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn48 => {
            const RootNodeT = _fn48.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1152)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn49 => {
            const RootNodeT = _fn49.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1153)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn50 => {
            const RootNodeT = _fn50.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1156)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn51 => {
            const RootNodeT = _fn51.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1157)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn52 => {
            const RootNodeT = _fn52.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Element")))
            ];
          }),
          t.function(_fn53 => {
            const RootNodeT = _fn53.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(4)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Text")))
            ];
          }),
          t.function(_fn54 => {
            const RootNodeT = _fn54.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(5)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Element"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn55 => {
            const RootNodeT = _fn55.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(128)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Comment")))
            ];
          }),
          t.function(_fn56 => {
            const RootNodeT = _fn56.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(129)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn57 => {
            const RootNodeT = _fn57.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(132)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Text"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn58 => {
            const RootNodeT = _fn58.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(133)),
              t.param("filter", NodeFilterInterface, true),
              t.return(
                t.ref(
                  "NodeIterator",
                  RootNodeT,
                  t.union(t.ref("Text"), t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn59 => {
            const RootNodeT = _fn59.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(-1)),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Node")))
            ];
          }),
          t.function(_fn60 => {
            const RootNodeT = _fn60.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number()),
              t.param("filter", NodeFilterInterface, true),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Node")))
            ];
          }),
          t.function(_fn61 => {
            const RootNodeT = _fn61.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.void()),
              t.return(t.ref("NodeIterator", RootNodeT, t.ref("Node")))
            ];
          })
        )
      ),
      t.property(
        "createTreeWalker",
        t.union(
          t.function(_fn62 => {
            const RootNodeT = _fn62.typeParameter("RootNodeT", t.ref("Attr"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(2)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Attr")))
            ];
          }),
          t.function(_fn63 => {
            const RootNodeT = _fn63.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(256)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Document")))
            ];
          }),
          t.function(_fn64 => {
            const RootNodeT = _fn64.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(257)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn65 => {
            const RootNodeT = _fn65.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(260)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn66 => {
            const RootNodeT = _fn66.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(261)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn67 => {
            const RootNodeT = _fn67.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(384)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn68 => {
            const RootNodeT = _fn68.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(385)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn69 => {
            const RootNodeT = _fn69.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(388)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Document"), t.ref("Text"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn70 => {
            const RootNodeT = _fn70.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(389)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn71 => {
            const RootNodeT = _fn71.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(512)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("DocumentType")))
            ];
          }),
          t.function(_fn72 => {
            const RootNodeT = _fn72.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(513)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn73 => {
            const RootNodeT = _fn73.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(516)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn74 => {
            const RootNodeT = _fn74.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(517)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn75 => {
            const RootNodeT = _fn75.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(640)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn76 => {
            const RootNodeT = _fn76.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(641)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn77 => {
            const RootNodeT = _fn77.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(644)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn78 => {
            const RootNodeT = _fn78.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(645)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn79 => {
            const RootNodeT = _fn79.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(768)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentType"), t.ref("Document"))
                )
              )
            ];
          }),
          t.function(_fn80 => {
            const RootNodeT = _fn80.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(769)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element")
                  )
                )
              )
            ];
          }),
          t.function(_fn81 => {
            const RootNodeT = _fn81.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(772)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn82 => {
            const RootNodeT = _fn82.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(773)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn83 => {
            const RootNodeT = _fn83.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(896)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn84 => {
            const RootNodeT = _fn84.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(897)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn85 => {
            const RootNodeT = _fn85.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(900)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn86 => {
            const RootNodeT = _fn86.typeParameter(
              "RootNodeT",
              t.ref("Document")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(901)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentType"),
                    t.ref("Document"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn87 => {
            const RootNodeT = _fn87.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1024)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref("TreeWalker", RootNodeT, t.ref("DocumentFragment"))
              )
            ];
          }),
          t.function(_fn88 => {
            const RootNodeT = _fn88.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1025)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Element"))
                )
              )
            ];
          }),
          t.function(_fn89 => {
            const RootNodeT = _fn89.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1028)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn90 => {
            const RootNodeT = _fn90.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1029)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Text")
                  )
                )
              )
            ];
          }),
          t.function(_fn91 => {
            const RootNodeT = _fn91.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1152)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("DocumentFragment"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn92 => {
            const RootNodeT = _fn92.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1153)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn93 => {
            const RootNodeT = _fn93.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1156)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn94 => {
            const RootNodeT = _fn94.typeParameter(
              "RootNodeT",
              t.ref("DocumentFragment")
            );

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1157)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(
                    t.ref("DocumentFragment"),
                    t.ref("Element"),
                    t.ref("Text"),
                    t.ref("Comment")
                  )
                )
              )
            ];
          }),
          t.function(_fn95 => {
            const RootNodeT = _fn95.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(1)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Element")))
            ];
          }),
          t.function(_fn96 => {
            const RootNodeT = _fn96.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(4)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Text")))
            ];
          }),
          t.function(_fn97 => {
            const RootNodeT = _fn97.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(5)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Element"), t.ref("Text"))
                )
              )
            ];
          }),
          t.function(_fn98 => {
            const RootNodeT = _fn98.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(128)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Comment")))
            ];
          }),
          t.function(_fn99 => {
            const RootNodeT = _fn99.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(129)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn100 => {
            const RootNodeT = _fn100.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(132)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Text"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn101 => {
            const RootNodeT = _fn101.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(133)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(
                t.ref(
                  "TreeWalker",
                  RootNodeT,
                  t.union(t.ref("Text"), t.ref("Element"), t.ref("Comment"))
                )
              )
            ];
          }),
          t.function(_fn102 => {
            const RootNodeT = _fn102.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number(-1)),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Node")))
            ];
          }),
          t.function(_fn103 => {
            const RootNodeT = _fn103.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.number()),
              t.param("filter", NodeFilterInterface, true),
              t.param("entityReferenceExpansion", t.boolean(), true),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Node")))
            ];
          }),
          t.function(_fn104 => {
            const RootNodeT = _fn104.typeParameter("RootNodeT", t.ref("Node"));

            return [
              t.param("root", RootNodeT),
              t.param("whatToShow", t.void()),
              t.return(t.ref("TreeWalker", RootNodeT, t.ref("Node")))
            ];
          })
        )
      )
    ),
    t.extends("Node")
  )
);
t.declare(
  t.class(
    "Node",
    t.object(
      t.property("baseURI", t.nullable(t.string())),
      t.property("childNodes", t.ref("NodeList", t.ref("Node"))),
      t.property("firstChild", t.nullable(t.ref("Node"))),
      t.property("lastChild", t.nullable(t.ref("Node"))),
      t.property("nextSibling", t.nullable(t.ref("Node"))),
      t.property("nodeName", t.string()),
      t.property("nodeType", t.number()),
      t.property("nodeValue", t.string()),
      t.property("ownerDocument", t.ref("Document")),
      t.property("parentElement", t.nullable(t.ref("Element"))),
      t.property("parentNode", t.nullable(t.ref("Node"))),
      t.property("previousSibling", t.nullable(t.ref("Node"))),
      t.property("rootNode", t.ref("Node")),
      t.property("textContent", t.string()),
      t.property(
        "appendChild",
        t.function(_fn105 => {
          const T = _fn105.typeParameter("T", t.ref("Node"));

          return [ t.param("newChild", T), t.return(T) ];
        })
      ),
      t.property(
        "cloneNode",
        t.function(t.param("deep", t.boolean(), true), t.return(t.ref("this")))
      ),
      t.property(
        "compareDocumentPosition",
        t.function(t.param("other", t.ref("Node")), t.return(t.number()))
      ),
      t.property(
        "contains",
        t.function(
          t.param("other", t.nullable(t.ref("Node"))),
          t.return(t.boolean())
        )
      ),
      t.property("hasChildNodes", t.function(t.return(t.boolean()))),
      t.property(
        "insertBefore",
        t.function(_fn106 => {
          const T = _fn106.typeParameter("T", t.ref("Node"));

          return [
            t.param("newChild", T),
            t.param("refChild", t.nullable(t.ref("Node")), true),
            t.return(T)
          ];
        })
      ),
      t.property(
        "isDefaultNamespace",
        t.function(t.param("namespaceURI", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "isEqualNode",
        t.function(t.param("arg", t.ref("Node")), t.return(t.boolean()))
      ),
      t.property(
        "isSameNode",
        t.function(t.param("other", t.ref("Node")), t.return(t.boolean()))
      ),
      t.property(
        "lookupNamespaceURI",
        t.function(t.param("prefix", t.string()), t.return(t.string()))
      ),
      t.property(
        "lookupPrefix",
        t.function(t.param("namespaceURI", t.string()), t.return(t.string()))
      ),
      t.property("normalize", t.function(t.return(t.void()))),
      t.property(
        "removeChild",
        t.function(_fn107 => {
          const T = _fn107.typeParameter("T", t.ref("Node"));

          return [ t.param("oldChild", T), t.return(T) ];
        })
      ),
      t.property(
        "replaceChild",
        t.function(_fn108 => {
          const T = _fn108.typeParameter("T", t.ref("Node"));

          return [
            t.param("newChild", t.ref("Node")),
            t.param("oldChild", T),
            t.return(T)
          ];
        })
      ),
      t.staticProperty("ATTRIBUTE_NODE", t.number()),
      t.staticProperty("CDATA_SECTION_NODE", t.number()),
      t.staticProperty("COMMENT_NODE", t.number()),
      t.staticProperty("DOCUMENT_FRAGMENT_NODE", t.number()),
      t.staticProperty("DOCUMENT_NODE", t.number()),
      t.staticProperty("DOCUMENT_POSITION_CONTAINED_BY", t.number()),
      t.staticProperty("DOCUMENT_POSITION_CONTAINS", t.number()),
      t.staticProperty("DOCUMENT_POSITION_DISCONNECTED", t.number()),
      t.staticProperty("DOCUMENT_POSITION_FOLLOWING", t.number()),
      t.staticProperty("DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", t.number()),
      t.staticProperty("DOCUMENT_POSITION_PRECEDING", t.number()),
      t.staticProperty("DOCUMENT_TYPE_NODE", t.number()),
      t.staticProperty("ELEMENT_NODE", t.number()),
      t.staticProperty("ENTITY_NODE", t.number()),
      t.staticProperty("ENTITY_REFERENCE_NODE", t.number()),
      t.staticProperty("NOTATION_NODE", t.number()),
      t.staticProperty("PROCESSING_INSTRUCTION_NODE", t.number()),
      t.staticProperty("TEXT_NODE", t.number()),
      t.property("innerText", t.string(), true),
      t.property("outerText", t.string(), true)
    ),
    t.extends("EventTarget")
  )
);
const ShadowRootMode = t.type(
  "ShadowRootMode",
  t.union(t.string("open"), t.string("closed"))
);
const ShadowRootInit = t.type(
  "ShadowRootInit",
  t.object(
    t.property("delegatesFocus", t.boolean(), true),
    t.property("mode", ShadowRootMode)
  )
);
const ShadowRoot = t.type(
  "ShadowRoot",
  t.intersect(
    t.ref("DocumentFragment"),
    t.object(
      t.property("host", t.ref("Element")),
      t.property("innerHTML", t.string())
    )
  )
);
t.declare(
  t.class(
    "Element",
    t.object(
      t.property("assignedSlot", t.nullable(t.ref("HTMLSlotElement"))),
      t.property(
        "attachShadow",
        t.function(
          t.param("shadowRootInitDict", ShadowRootInit),
          t.return(ShadowRoot)
        )
      ),
      t.property("attributes", t.ref("NamedNodeMap")),
      t.property("childElementCount", t.number()),
      t.property("children", t.ref("HTMLCollection", t.ref("HTMLElement"))),
      t.property("classList", t.ref("DOMTokenList")),
      t.property("className", t.string()),
      t.property("clientHeight", t.number()),
      t.property("clientLeft", t.number()),
      t.property("clientTop", t.number()),
      t.property("clientWidth", t.number()),
      t.property("firstElementChild", t.nullable(t.ref("Element"))),
      t.property("id", t.string()),
      t.property("innerHTML", t.string()),
      t.property("lastElementChild", t.nullable(t.ref("Element"))),
      t.property("localName", t.string()),
      t.property("namespaceURI", t.nullable(t.string())),
      t.property("nextElementSibling", t.nullable(t.ref("Element"))),
      t.property("outerHTML", t.string()),
      t.property("prefix", t.union(t.string(), t.null())),
      t.property("previousElementSibling", t.nullable(t.ref("Element"))),
      t.property("scrollHeight", t.number()),
      t.property("scrollLeft", t.number()),
      t.property("scrollTop", t.number()),
      t.property("scrollWidth", t.number()),
      t.property("tagName", t.string()),
      t.property(
        "closest",
        t.function(
          t.param("selectors", t.string()),
          t.return(t.nullable(t.ref("Element")))
        )
      ),
      t.property(
        "dispatchEvent",
        t.function(t.param("event", t.ref("Event")), t.return(t.boolean()))
      ),
      t.property(
        "getAttribute",
        t.function(
          t.param("name", t.string(), true),
          t.return(t.nullable(t.string()))
        )
      ),
      t.property(
        "getAttributeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("localName", t.string()),
          t.return(t.union(t.string(), t.null()))
        )
      ),
      t.property(
        "getAttributeNode",
        t.function(
          t.param("name", t.string()),
          t.return(t.union(t.ref("Attr"), t.null()))
        )
      ),
      t.property(
        "getAttributeNodeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("localName", t.string()),
          t.return(t.union(t.ref("Attr"), t.null()))
        )
      ),
      t.property(
        "getBoundingClientRect",
        t.function(t.return(t.ref("ClientRect")))
      ),
      t.property(
        "getClientRects",
        t.function(t.return(t.array(t.ref("ClientRect"))))
      ),
      t.property(
        "getElementsByClassName",
        t.function(
          t.param("names", t.string()),
          t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
        )
      ),
      t.property(
        "getElementsByTagName",
        t.union(
          t.function(
            t.param("name", t.string("a")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAnchorElement")))
          ),
          t.function(
            t.param("name", t.string("audio")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAudioElement")))
          ),
          t.function(
            t.param("name", t.string("button")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLButtonElement")))
          ),
          t.function(
            t.param("name", t.string("canvas")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLCanvasElement")))
          ),
          t.function(
            t.param("name", t.string("div")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLDivElement")))
          ),
          t.function(
            t.param("name", t.string("form")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLFormElement")))
          ),
          t.function(
            t.param("name", t.string("iframe")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLIFrameElement")))
          ),
          t.function(
            t.param("name", t.string("img")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLImageElement")))
          ),
          t.function(
            t.param("name", t.string("input")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLInputElement")))
          ),
          t.function(
            t.param("name", t.string("label")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLabelElement")))
          ),
          t.function(
            t.param("name", t.string("link")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLinkElement")))
          ),
          t.function(
            t.param("name", t.string("media")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMediaElement")))
          ),
          t.function(
            t.param("name", t.string("meta")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMetaElement")))
          ),
          t.function(
            t.param("name", t.string("option")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLOptionElement")))
          ),
          t.function(
            t.param("name", t.string("p")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLParagraphElement")))
          ),
          t.function(
            t.param("name", t.string("script")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLScriptElement")))
          ),
          t.function(
            t.param("name", t.string("select")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSelectElement")))
          ),
          t.function(
            t.param("name", t.string("source")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSourceElement")))
          ),
          t.function(
            t.param("name", t.string("span")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSpanElement")))
          ),
          t.function(
            t.param("name", t.string("style")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLStyleElement")))
          ),
          t.function(
            t.param("name", t.string("textarea")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTextAreaElement")))
          ),
          t.function(
            t.param("name", t.string("video")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLVideoElement")))
          ),
          t.function(
            t.param("name", t.string("table")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableElement")))
          ),
          t.function(
            t.param("name", t.string("caption")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCaptionElement")))
          ),
          t.function(
            t.param(
              "name",
              t.union(t.string("thead"), t.string("tfoot"), t.string("tbody"))
            ),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableSectionElement")))
          ),
          t.function(
            t.param("name", t.string("tr")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableRowElement")))
          ),
          t.function(
            t.param("name", t.union(t.string("td"), t.string("th"))),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCellElement")))
          ),
          t.function(
            t.param("name", t.string()),
            t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
          )
        )
      ),
      t.property(
        "getElementsByTagNameNS",
        t.union(
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("a")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAnchorElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("audio")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLAudioElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("button")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLButtonElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("canvas")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLCanvasElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("div")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLDivElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("form")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLFormElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("iframe")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLIFrameElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("img")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLImageElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("input")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLInputElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("label")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLabelElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("link")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLLinkElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("media")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMediaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("meta")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLMetaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("option")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLOptionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("p")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLParagraphElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("script")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLScriptElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("select")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSelectElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("source")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSourceElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("span")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLSpanElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("style")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLStyleElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("textarea")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTextAreaElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("video")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLVideoElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("table")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("caption")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCaptionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param(
              "localName",
              t.union(t.string("thead"), t.string("tfoot"), t.string("tbody"))
            ),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableSectionElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string("tr")),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableRowElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.union(t.string("td"), t.string("th"))),
            t.return(t.ref("HTMLCollection", t.ref("HTMLTableCellElement")))
          ),
          t.function(
            t.param("namespaceURI", t.union(t.string(), t.null())),
            t.param("localName", t.string()),
            t.return(t.ref("HTMLCollection", t.ref("HTMLElement")))
          )
        )
      ),
      t.property(
        "hasAttribute",
        t.function(t.param("name", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "hasAttributeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("localName", t.string()),
          t.return(t.boolean())
        )
      ),
      t.property(
        "insertAdjacentElement",
        t.function(
          t.param(
            "position",
            t.union(
              t.string("beforebegin"),
              t.string("afterbegin"),
              t.string("beforeend"),
              t.string("afterend")
            )
          ),
          t.param("element", t.ref("Element")),
          t.return(t.void())
        )
      ),
      t.property(
        "insertAdjacentHTML",
        t.function(
          t.param(
            "position",
            t.union(
              t.string("beforebegin"),
              t.string("afterbegin"),
              t.string("beforeend"),
              t.string("afterend")
            )
          ),
          t.param("html", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "insertAdjacentText",
        t.function(
          t.param(
            "position",
            t.union(
              t.string("beforebegin"),
              t.string("afterbegin"),
              t.string("beforeend"),
              t.string("afterend")
            )
          ),
          t.param("text", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "matches",
        t.function(t.param("selector", t.string()), t.return(t.boolean()))
      ),
      t.property(
        "querySelector",
        t.function(
          t.param("selector", t.string()),
          t.return(t.union(t.ref("HTMLElement"), t.null()))
        )
      ),
      t.property(
        "querySelectorAll",
        t.function(
          t.param("selector", t.string()),
          t.return(t.ref("NodeList", t.ref("HTMLElement")))
        )
      ),
      t.property(
        "releasePointerCapture",
        t.function(t.param("pointerId", t.string()), t.return(t.void()))
      ),
      t.property("remove", t.function(t.return(t.void()))),
      t.property(
        "removeAttribute",
        t.function(t.param("name", t.string(), true), t.return(t.void()))
      ),
      t.property(
        "removeAttributeNode",
        t.function(
          t.param("attributeNode", t.ref("Attr")),
          t.return(t.ref("Attr"))
        )
      ),
      t.property(
        "removeAttributeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("localName", t.string()),
          t.return(t.void())
        )
      ),
      t.property("requestFullscren", t.function(t.return(t.void()))),
      t.property("requestPointerLock", t.function(t.return(t.void()))),
      t.property(
        "scrollIntoView",
        t.function(
          t.param(
            "arg",
            t.union(
              t.boolean(),
              t.object(
                t.property(
                  "behavior",
                  t.union(
                    t.string("auto"),
                    t.string("instant"),
                    t.string("smooth")
                  ),
                  true
                ),
                t.property(
                  "block",
                  t.union(t.string("start"), t.string("end")),
                  true
                )
              )
            ),
            true
          ),
          t.return(t.void())
        )
      ),
      t.property(
        "setAttribute",
        t.function(
          t.param("name", t.string(), true),
          t.param("value", t.string(), true),
          t.return(t.void())
        )
      ),
      t.property(
        "setAttributeNS",
        t.function(
          t.param("namespaceURI", t.union(t.string(), t.null())),
          t.param("qualifiedName", t.string()),
          t.param("value", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "setAttributeNode",
        t.function(
          t.param("newAttr", t.ref("Attr")),
          t.return(t.union(t.ref("Attr"), t.null()))
        )
      ),
      t.property(
        "setAttributeNodeNS",
        t.function(
          t.param("newAttr", t.ref("Attr")),
          t.return(t.union(t.ref("Attr"), t.null()))
        )
      ),
      t.property(
        "setPointerCapture",
        t.function(t.param("pointerId", t.string()), t.return(t.void()))
      ),
      t.property("shadowRoot", ShadowRoot, true),
      t.property("slot", t.string(), true)
    ),
    t.extends("Node")
  )
);
t.declare(
  t.class(
    "DataTransferItem",
    t.object(
      t.property("kind", t.string()),
      t.property("type", t.string()),
      t.property(
        "getAsString",
        t.function(
          t.param(
            "_callback",
            t.nullable(
              t.function(t.param("data", t.string()), t.return(t.mixed()))
            )
          ),
          t.return(t.void())
        )
      ),
      t.property("getAsFile", t.function(t.return(t.nullable(t.ref("File")))))
    )
  )
);
t.declare(
  t.class(
    "DataTransferItemList",
    t.object(
      t.property(
        "____iterator",
        t.function(t.return(t.ref(Iterator, t.ref("DataTransferItem"))))
      ),
      t.property("length", t.number()),
      t.property(
        "add",
        t.union(
          t.function(
            t.param("data", t.string()),
            t.param("type", t.string()),
            t.return(t.nullable(t.ref("DataTransferItem")))
          ),
          t.function(
            t.param("data", t.ref("File")),
            t.return(t.nullable(t.ref("DataTransferItem")))
          )
        )
      ),
      t.property(
        "remove",
        t.function(t.param("index", t.number()), t.return(t.void()))
      ),
      t.property("clear", t.function(t.return(t.void()))),
      t.indexer("index", t.number(), t.ref("DataTransferItem"))
    )
  )
);
t.declare(
  t.class(
    "DataTransfer",
    t.object(
      t.property(
        "clearData",
        t.function(t.param("format", t.string(), true), t.return(t.void()))
      ),
      t.property(
        "getData",
        t.function(t.param("format", t.string()), t.return(t.string()))
      ),
      t.property(
        "setData",
        t.function(
          t.param("format", t.string()),
          t.param("data", t.string()),
          t.return(t.void())
        )
      ),
      t.property(
        "setDragImage",
        t.function(
          t.param("image", t.ref("Element")),
          t.param("x", t.number()),
          t.param("y", t.number()),
          t.return(t.void())
        )
      ),
      t.property("dropEffect", t.string()),
      t.property("effectAllowed", t.string()),
      t.property("files", t.ref("FileList")),
      t.property("items", t.ref("DataTransferItemList")),
      t.property("types", t.array(t.string()))
    )
  )
);
t.declare(
  t.class(
    "DragEvent",
    t.object(t.property("dataTransfer", t.nullable(t.ref("DataTransfer")))),
    t.extends("MouseEvent")
  )
);
const DragEventHandler = t.type(
  "DragEventHandler",
  t.function(t.param("event", t.ref("DragEvent")), t.return(t.mixed()))
);
const DragEventListener = t.type(
  "DragEventListener",
  t.union(
    t.object(t.property("handleEvent", DragEventHandler)),
    DragEventHandler
  )
);
const EventHandler = t.type(
  "EventHandler",
  t.function(t.param("event", t.ref("Event")), t.return(t.mixed()))
);
const EventListener = t.type(
  "EventListener",
  t.union(t.object(t.property("handleEvent", EventHandler)), EventHandler)
);
t.declare(
  t.class(
    "EventTarget",
    t.object(
      t.property(
        "addEventListener",
        t.union(
          t.function(
            t.param("type", MouseEventTypes),
            t.param("listener", MouseEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", KeyboardEventTypes),
            t.param("listener", KeyboardEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", TouchEventTypes),
            t.param("listener", TouchEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", WheelEventTypes),
            t.param("listener", WheelEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", ProgressEventTypes),
            t.param("listener", ProgressEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", DragEventTypes),
            t.param("listener", DragEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", t.string()),
            t.param("listener", EventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "removeEventListener",
        t.union(
          t.function(
            t.param("type", MouseEventTypes),
            t.param("listener", MouseEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", KeyboardEventTypes),
            t.param("listener", KeyboardEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", TouchEventTypes),
            t.param("listener", TouchEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", WheelEventTypes),
            t.param("listener", WheelEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", ProgressEventTypes),
            t.param("listener", ProgressEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", DragEventTypes),
            t.param("listener", DragEventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          ),
          t.function(
            t.param("type", t.string()),
            t.param("listener", EventListener),
            t.param(
              "optionsOrUseCapture",
              EventListenerOptionsOrUseCapture,
              true
            ),
            t.return(t.void())
          )
        )
      ),
      t.property(
        "attachEvent",
        t.union(
          t.function(
            t.param("type", MouseEventTypes),
            t.param("listener", MouseEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", KeyboardEventTypes),
            t.param("listener", KeyboardEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", TouchEventTypes),
            t.param("listener", TouchEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", WheelEventTypes),
            t.param("listener", WheelEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", ProgressEventTypes),
            t.param("listener", ProgressEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", DragEventTypes),
            t.param("listener", DragEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", t.string()),
            t.param("listener", EventListener),
            t.return(t.void())
          )
        ),
        true
      ),
      t.property(
        "detachEvent",
        t.union(
          t.function(
            t.param("type", MouseEventTypes),
            t.param("listener", MouseEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", KeyboardEventTypes),
            t.param("listener", KeyboardEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", TouchEventTypes),
            t.param("listener", TouchEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", WheelEventTypes),
            t.param("listener", WheelEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", ProgressEventTypes),
            t.param("listener", ProgressEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", DragEventTypes),
            t.param("listener", DragEventListener),
            t.return(t.void())
          ),
          t.function(
            t.param("type", t.string()),
            t.param("listener", EventListener),
            t.return(t.void())
          )
        ),
        true
      ),
      t.property(
        "dispatchEvent",
        t.function(t.param("evt", t.ref("Event")), t.return(t.boolean()))
      )
    )
  )
);
t.declare(
  t.class(
    "Event",
    t.object(
      t.property(
        "constructor",
        t.function(
          t.param("type", t.string()),
          t.param("eventInitDict", Event$Init, true),
          t.return(t.void())
        )
      ),
      t.property("bubbles", t.boolean()),
      t.property("cancelable", t.boolean()),
      t.property("currentTarget", t.ref("EventTarget")),
      t.property(
        "deepPath",
        t.function(t.return(t.array(t.ref("EventTarget")))),
        true
      ),
      t.property("defaultPrevented", t.boolean()),
      t.property("eventPhase", t.number()),
      t.property("isTrusted", t.boolean()),
      t.property("scoped", t.nullable(t.boolean())),
      t.property(
        "srcElement",
        t.union(t.nullable(t.ref("Element")), t.object())
      ),
      t.property("target", t.ref("EventTarget")),
      t.property("timeStamp", t.number()),
      t.property("type", t.string()),
      t.property("preventDefault", t.function(t.return(t.void()))),
      t.property("stopImmediatePropagation", t.function(t.return(t.void()))),
      t.property("stopPropagation", t.function(t.return(t.void()))),
      t.staticProperty("AT_TARGET", t.number()),
      t.staticProperty("BUBBLING_PHASE", t.number()),
      t.staticProperty("CAPTURING_PHASE", t.number())
    )
  )
);
const WindowProxy = t.type("WindowProxy", t.any());
t.declare(
  t.class(
    "MessageEvent",
    t.object(
      t.property("data", t.mixed()),
      t.property("origin", t.string()),
      t.property("lastEventId", t.string()),
      t.property("source", WindowProxy)
    ),
    t.extends("Event")
  )
);
t.declare(
  t.class(
    "WorkerLocation",
    t.object(
      t.property("origin", t.string()),
      t.property("protocol", t.string()),
      t.property("host", t.string()),
      t.property("hostname", t.string()),
      t.property("port", t.string()),
      t.property("pathname", t.string()),
      t.property("search", t.string()),
      t.property("hash", t.string())
    )
  )
);
t.declare(t.class("WorkerNavigator", t.object()));
t.declare(
  t.class(
    "WorkerGlobalScope",
    t.object(
      t.property("self", t.ref("WorkerGlobalScope")),
      t.property("location", t.ref("WorkerLocation")),
      t.property("navigator", t.ref("WorkerNavigator")),
      t.property("close", t.function(t.return(t.void()))),
      t.property(
        "importScripts",
        t.function(t.rest("urls", t.array(t.string())), t.return(t.void()))
      ),
      t.property(
        "onerror",
        t.function(t.param("ev", t.ref("Event")), t.return(t.any()))
      ),
      t.property(
        "onlanguagechange",
        t.function(t.param("ev", t.ref("Event")), t.return(t.any()))
      ),
      t.property(
        "onoffline",
        t.function(t.param("ev", t.ref("Event")), t.return(t.any()))
      ),
      t.property(
        "ononline",
        t.function(t.param("ev", t.ref("Event")), t.return(t.any()))
      ),
      t.property(
        "onrejectionhandled",
        t.function(
          t.param("ev", t.ref("PromiseRejectionEvent")),
          t.return(t.any())
        )
      ),
      t.property(
        "onunhandledrejection",
        t.function(
          t.param("ev", t.ref("PromiseRejectionEvent")),
          t.return(t.any())
        )
      )
    ),
    t.extends("EventTarget")
  )
);
t.declare(
  t.class(
    "DedicatedWorkerGlobalScope",
    t.object(
      t.property(
        "onmessage",
        t.function(
          t.return(
            t.function(t.param("ev", t.ref("MessageEvent")), t.return(t.any()))
          )
        )
      ),
      t.property(
        "postMessage",
        t.function(
          t.param("message", t.any()),
          t.param("transfer", t.ref(Iterable, t.object()), true),
          t.return(t.void())
        )
      )
    ),
    t.extends("WorkerGlobalScope")
  )
);
t.declare(
  t.class(
    "SyntheticEvent",
    t.object(
      t.property("bubbles", t.boolean()),
      t.property("cancelable", t.boolean()),
      t.property("currentTarget", t.ref("EventTarget")),
      t.property("defaultPrevented", t.boolean()),
      t.property("eventPhase", t.number()),
      t.property("isDefaultPrevented", t.function(t.return(t.boolean()))),
      t.property("isPropagationStopped", t.function(t.return(t.boolean()))),
      t.property("isTrusted", t.boolean()),
      t.property("nativeEvent", t.ref("Event")),
      t.property("preventDefault", t.function(t.return(t.void()))),
      t.property("stopPropagation", t.function(t.return(t.void()))),
      t.property("target", t.ref("EventTarget")),
      t.property("timeStamp", t.number()),
      t.property("type", t.string()),
      t.property("persist", t.function(t.return(t.void())))
    )
  )
);
t.declare(
  t.class(
    "SyntheticUIEvent",
    t.object(t.property("detail", t.number()), t.property("view", t.any())),
    t.extends("SyntheticEvent")
  )
);
t.declare(
  t.class(
    "SyntheticMouseEvent",
    t.object(
      t.property("altKey", t.boolean()),
      t.property("button", t.number()),
      t.property("buttons", t.number()),
      t.property("clientX", t.number()),
      t.property("clientY", t.number()),
      t.property("ctrlKey", t.boolean()),
      t.property("getModifierState", t.any()),
      t.property("metaKey", t.boolean()),
      t.property("pageX", t.number()),
      t.property("pageY", t.number()),
      t.property("relatedTarget", t.nullable(t.ref("EventTarget"))),
      t.property("screenX", t.number()),
      t.property("screenY", t.number()),
      t.property("shiftKey", t.boolean())
    ),
    t.extends("SyntheticUIEvent")
  )
);

