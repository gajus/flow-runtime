# flow-runtime-loader

A webpack loader for turning Flow type modules into `flow-runtime` declarations.

This is useful when a dependency ships Flow definitions next to its source, for example `*.js.flow` files, and you want to import those types as runtime validators.

## Installation

```sh
npm install --save-dev flow-runtime-loader
```

## Usage

Inline usage:

```js
import { RawDraftContentState } from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

RawDraftContentState.assert(value);
```

Webpack rule:

```js
module.exports = {
  resolve: {
    extensions: ['.js.flow', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js\.flow$/,
        use: [
          {
            loader: 'flow-runtime-loader',
            options: {
              assert: true,
              annotate: true
            }
          }
        ]
      }
    ]
  }
};
```

Loader options are passed to `babel-plugin-flow-runtime`. An optional `babel` option can be used to pass additional Babel transform options:

```js
{
  loader: 'flow-runtime-loader',
  options: {
    libraryName: './custom-flow-runtime',
    babel: {
      sourceMaps: true
    }
  }
}
```
