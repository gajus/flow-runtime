# flow-runtime-cli

A command line interface for working with [flow-runtime](https://github.com/codemix/flow-runtime) and [Flow](https://flowtype.org/).

## What?
Discovers imported and global type dependencies in your source code and produces a single file containing the flow-runtime type definitions for those dependencies.

## What?
Let's say you have some code like this:

```js
/* @flow */
function get (store: Storage, key: string) {
  return store.getItem(key);
}

get(localStorage, 'foo');
```

`Storage` is a global type, built in to Flow, but flow-runtime itself doesn't know anything about it - if you compile this code, flow-runtime will emit a warning about being unable to resolve a type called "Storage".
A possible solution to this would be to include all the type definitions which come with Flow as part of flow-runtime, but this is wasteful - the file would be very large and most definitions would go unused.

To solve this problem, `flow-runtime-cli`:

1. Crawls your project source code looking for these types.
2. Discovers the matching type definitions in `flow-typed` or wherever specified by your `.flowconfig` file.
3. Creates a graph of dependencies and generates the code for only the types you use, this produces a file that looks like this:

```js
import t from "flow-runtime";
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
```

You can then import this file once, in your entry point, and `flow-runtime` will be able to validates values of this type.

## Installation

```
npm install flow-runtime-cli
```
or
```
yarn add flow-runtime-cli
```


## Usage

If your source files are in a folder called `src`, run:

```sh
flow-runtime generate ./src > ./src/typedefs.js
```

then, in your entry point (e.g. `index.js`) your first import should be:
```js
import './typedefs';
```