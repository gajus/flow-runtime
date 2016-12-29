# Flow Runtime

A runtime type system for JavaScript with full [Flow](https://flowtype.org/) compatibility.

This is a mono-repo, composed of the following projects:

  - [flow-runtime](./packages/flow-runtime): The core runtime type system.
  - [babel-plugin-flow-runtime](./packages/babel-plugin-flow-runtime): A babel plugin which transforms Flow type annotations into `flow-runtime` invocations.
  - [flow-config-parser](./packages/flow-config-parser): Parses flow configuration files.
  - [flow-runtime-demo](./packages/flow-runtime-demo): React & Express demo application.
