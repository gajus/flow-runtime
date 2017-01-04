# Flow Runtime
[![Build Status](https://travis-ci.org/codemix/flow-runtime.svg?branch=master)](https://travis-ci.org/codemix/flow-runtime)

A runtime type system for JavaScript with full [Flow](https://flowtype.org/) compatibility.

[See the website for more information](https://codemix.github.io/flow-runtime/).

---

This is a [lerna](https://github.com/lerna/lerna) powered mono-repo, composed of the following projects:

  - [flow-runtime](./packages/flow-runtime): The core runtime type system.
  - [babel-plugin-flow-runtime](./packages/babel-plugin-flow-runtime): A babel plugin which transforms Flow type annotations into `flow-runtime` invocations.
  - [flow-config-parser](./packages/flow-config-parser): Parses flow configuration files.
  - [flow-runtime-docs](./packages/flow-runtime-docs): React powered documentation site.

## Contributing

First clone the repo:

```sh
git clone https://github.com/codemix/flow-runtime.git
```

Now install `lerna` globally:

```sh
npm install --global lerna
```

And bootstrap the project:

```sh
cd flow-runtime
lerna bootstrap
npm test
```