# flow-runtime-loader

A webpack loader for importing Flow type declarations as `flow-runtime` runtime validators.

This is useful when a package ships Flow definition files next to its source, for example `*.js.flow` files, and you want to validate values against those definitions at runtime.

## Installation

```sh
npm install --save-dev flow-runtime-loader
```

## Inline Usage

```js
import { RawDraftContentState } from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

RawDraftContentState.assert(value);
```

## Webpack Rule

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
              annotate: false
            }
          }
        ]
      }
    ]
  }
};
```

Loader options are passed to `babel-plugin-flow-runtime`. Use the `babel` option for Babel transform options:

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

By default the loader disables project-level Babel config so that importing a dependency's `*.js.flow` file does not accidentally inherit the consuming app's transforms. Pass `babel.babelrc` or `babel.configFile` to opt back in.
