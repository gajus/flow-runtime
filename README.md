# Flow Runtime
[![Build Status](https://travis-ci.org/gajus/flow-runtime.svg?branch=master)](https://travis-ci.org/gajus/flow-runtime)

A runtime type system for JavaScript with full [Flow](https://flowtype.org/) compatibility.

[See the website for more information](https://gajus.github.io/flow-runtime/).

---

## Maintenance Status

This project is not very well maintained anymore due to its complexity and maintainers' burnout with Flow in general.

### Statement from @jedwards1211

At the moment I need to keep this working in some production projects that use it for API input validation
(using the `optInOnly` option instead of blanket runtime validation everywhere).

However, I would like to eventually migrate those projects to either:
- a library where I declare validators that I can extract value types from.  I created [`typescript-validators`](https://github.com/jcoreio/typescript-validators)
  for this purpose in TypeScript
- a very pared-down version of `babel-plugin-flow-runtime` that generates validators where requested from Flow type annotations,
  but only supports certain types and doesn't automatically inject runtime validation everywhere.

If I had the time I would even migrate my production projects to TypeScript though, so I'm not sure I'll continue to use
Flow and `flow-runtime` heavily in the long term.

## Contributing

This is a [lerna](https://github.com/lerna/lerna) powered mono-repo, composed of the following projects:

  - [flow-runtime](./packages/flow-runtime): The core runtime type system.
  - [babel-plugin-flow-runtime](./packages/babel-plugin-flow-runtime): A babel plugin which transforms Flow type annotations into `flow-runtime` invocations.
  - [flow-runtime-validators](./packages/flow-runtime-validators): A collection of common validators for use with flow-runtime.
  - [flow-config-parser](./packages/flow-config-parser): Parses flow configuration files.
  - [flow-runtime-mobx](./packages/flow-runtime-mobx): Adds mobx support to flow-runtime.
  - [flow-runtime-docs](./packages/flow-runtime-docs): React powered documentation site.

### Getting started

First clone the repo:

```sh
git clone https://github.com/gajus/flow-runtime.git
```

And bootstrap the project:

```sh
cd flow-runtime
yarn
yarn bootstrap
yarn test
```
