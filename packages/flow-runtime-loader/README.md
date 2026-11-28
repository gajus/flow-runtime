# flow-runtime-loader

A webpack loader that turns flow library definition files (`.js.flow`) into
runtime type objects using [flow-runtime](https://github.com/gajus/flow-runtime).

## Motivation

Many packages ship their type information as `.js.flow` files rather than as
annotated source. Those files cannot be processed by the babel plugin directly
because they use `declare export` syntax. This loader normalizes that syntax
and compiles the declarations into `flow-runtime` type objects, so you can
import runtime type information straight out of a dependency:

```js
import {RawDraftContentState} from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

const valid = RawDraftContentState.assert({
  blocks: [
    {
      key: 'a',
      text: 'hello'
    }
  ],
  entityMap: {}
});
```

## Usage

Prefix the resource path with the loader name:

```js
import {SomeType} from 'flow-runtime-loader!some-package/lib/types.js.flow';
```

Or configure it for all `.js.flow` files:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js\.flow$/,
        use: 'flow-runtime-loader'
      }
    ]
  }
};
```

Note: the generated code imports `flow-runtime`, so it must be installed in
the project that consumes the type definitions.

## Options

Options can be passed through the standard webpack loader options. Under the
`flowRuntime` key you may override the options given to
`babel-plugin-flow-runtime` (by default the loader compiles with
`{assert: false, annotate: false}`, i.e. types are extracted without adding
assertions or annotations to any implementation code):

```js
{
  loader: 'flow-runtime-loader',
  options: {
    flowRuntime: {
      decorate: false
    }
  }
}
```
