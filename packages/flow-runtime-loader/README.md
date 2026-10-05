# flow-runtime-loader

Import Flow declaration files as `flow-runtime` validators with webpack. The loader converts types before removing Flow syntax, so a named type export remains a runtime value that can validate data.

## Inline imports

```js
import t from 'flow-runtime';
import { RawDraftContentState } from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

function storePost(body) {
  t.param('body', RawDraftContentState).assert(body);
  return storePostInDb({ body });
}
```

Type-only imports inside that declaration file are resolved using webpack, including aliases. A sibling `.js.flow` file is preferred over the resolved JavaScript implementation; declaration-only relative imports also work. Dependencies are passed through this loader recursively, so callers do not need a second rule to transform the library's type dependencies. Value imports in a mixed `import { type Model, value }` keep using the JavaScript implementation. Type re-exports and circular type references are supported.

## Rules

```js
module.exports = {
  module: {
    rules: [{
      test: /\.js\.flow$/,
      use: [{ loader: 'flow-runtime-loader', options: { annotate: false } }]
    }]
  }
};
```

Options are JSON-serializable `babel-plugin-flow-runtime` options, such as `libraryName`, `assert`, and `annotate`; they also apply to recursively imported declarations. Project Babel configuration is disabled for these dependency files. Webpack source maps and incoming maps are preserved. Resolution or conversion errors fail the build, including type modules explicitly disabled by webpack aliases. File paths containing webpack request delimiters (`!`, `?`, `#`) are rejected with an explicit error.

This package uses the repository's Babel 7 `babel-plugin-flow-runtime` version 0.20.0. It is a new workspace package, not a claim that this version has been published to npm. Bootstrap and build the existing plugin/runtime workspace packages before testing it. It inherits their supported Flow type syntax; it does not implement a separate Flow type system.

## Tests

With the workspace dependencies built, run `npm test` in this package. The test tools are pinned to Mocha 8.4.0, rimraf 3.0.2 and webpack 5.111.1; their minimum Node version is 10.13.0, matching the repository's Node 10 and 12 CI jobs. The tests compile real webpack bundles and execute real `flow-runtime` assertions, including DraftJS 0.11.7 declarations, invalid nested data, transitive declarations, aliases, mixed imports, re-exports, cycles, loader rules, source maps and build errors. No external services are used.
