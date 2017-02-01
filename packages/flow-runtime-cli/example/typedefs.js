import t from "flow-runtime";
t.declare(t.type("$FlowIssue", t.$flowFixMe()));
t.declare(t.type("$FlowIgnore", t.$flowFixMe()));
t.declare(t.type("$FlowFixme", t.$flowFixMe()));
t.declare(t.type("$Fixme", t.$flowFixMe()));
t.declare(
  t.class(
    "Storage",
    t.object(
      t.property("length", t.number()),
      t.property(
        "getItem",
        t.function(t.param("key", t.string()), t.return(t.nullable(t.string())))
      ),
      t.property(
        "setItem",
        t.function(
          t.param("key", t.string()),
          t.param("data", t.string()),
          t.return(t.void())
        )
      ),
      t.property("clear", t.function(t.return(t.void()))),
      t.property(
        "removeItem",
        t.function(t.param("key", t.string()), t.return(t.void()))
      ),
      t.property(
        "key",
        t.function(
          t.param("index", t.number()),
          t.return(t.nullable(t.string()))
        )
      ),
      t.indexer("name", t.string(), t.nullable(t.string()))
    )
  )
);

