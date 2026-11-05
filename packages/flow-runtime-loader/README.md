# flow-runtime-loader

Generate runtime validators from Flow modules and exported `.js.flow` types
using the existing `babel-plugin-flow-runtime` converter.

```sh
npm install --save-dev flow-runtime-loader
npm install flow-runtime
```

The original DraftJS use case works as a value import:

```js
import {RawDraftContentState} from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

function storePost(body) {
  RawDraftContentState.assert(body);
  // Persist only after successful validation.
}
```

Or configure a webpack rule for declaration files:

```js
module.exports = {
  module: {
    rules: [{test: /\.js\.flow$/, use: ['flow-runtime-loader']}]
  }
};
```

Then import validators as values, not `import type`, from the declaration file.
Do not apply this loader to all application JavaScript unless you intend to
convert its types into runtime values as well.

## Resolution

Type imports and type re-exports are recursively passed through this loader.
Webpack's resolver supplies aliases, dependency tracking and module caching.
For a type request, resolution tries `request.js.flow`, `request.flow`, then
the original request (including normal webpack extensions). Declaration
companions therefore take priority over executable JavaScript. Cyclic type
imports use the converter's existing lazy references. Generated modules
continue to import the normal `flow-runtime` peer dependency.

Application Babel configuration is disabled for this transformation; the
converter's own Flow configuration behavior remains unchanged. Compiler
errors and unresolved types fail the webpack build rather than emitting a
module without validators. Source maps retain the original Flow source.

## Scope and Limits

- This is a webpack loader, not a new Flow type checker or declaration
  generator. Type semantics and supported syntax come from the existing
  converter. It is not a promise to support every arbitrary Flow libdef.
- Use separate declarations for type and value imports. Mixed specifiers
  such as `import {type Person, makePerson} from './person'` are rejected
  explicitly rather than silently rerouting executable imports.
- Value imports remain normal webpack imports; compilation/bundling is not
  a sandbox for untrusted packages or source files.
- Tests exercise the published converter 0.19 and runtime 0.17 because the
  repository's 0.20 development versions are not published. Whole-monorepo
  bootstrap/build/test is not covered by these integration tests.
- Webpack 4 is legacy software. Its test dependency tree has known audit
  findings; this loader does not remediate those dependencies. Modern Node
  needs a process-local `NODE_OPTIONS=--openssl-legacy-provider` for Webpack 4.

## Tests

From this package directory, install dependencies without bootstrapping the
other monorepo packages:

```sh
npm install --ignore-scripts --workspaces=false --package-lock=false
npm test
```

Tests use Node's test runner (Node 18+), real webpack builds, temporary files
and DraftJS 0.11.7. Set `WEBPACK_VERSION=4` to run the same suite against the
Webpack 4 development alias. No server, cloud account or credentials are
required. This package is a proposed addition, not an already published npm
release.
