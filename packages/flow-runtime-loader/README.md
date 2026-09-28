# flow-runtime-loader

Compile Flow declarations into values that validate data at runtime. Requires
Webpack 4 or 5 and the corresponding `flow-runtime` runtime package.

```sh
npm install flow-runtime
npm install --save-dev flow-runtime-loader
```

Use an inline loader to import validators from a library's Flow source:

```js
import t from 'flow-runtime';
import { RawDraftContentState } from
  'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow';

function storePost(body) {
  t.param('body', RawDraftContentState).assert(body);
  return storePostInDb({ body });
}
```

Or configure a rule for your own Flow files:

```js
module.exports = {
  module: {
    rules: [{ test: /\.js\.flow$/, use: 'flow-runtime-loader' }]
  }
};
```

The loader runs `babel-plugin-flow-runtime` before removing Flow syntax. It
preserves ES module exports and lets Webpack perform bundling. Type-only imports
and re-exports are resolved through Webpack's resolver, including aliases. Where
available, a `.flow` sibling of the resolved JS file is preferred. Dependencies
are passed through this loader too, so imported types remain runtime values.
The recursive request disables other configured loaders to avoid stripping Flow
before conversion. Existing explicit loader requests are left to the author.
Value imports are left unchanged. Paths containing `!`, `?` or `#` cannot be
encoded safely as recursive inline requests and cause a clear build error.

The loader defaults to `{ assert: true, annotate: false }`. Use loader `options`
to pass supported `babel-plugin-flow-runtime` options such as `warn`, `annotate`,
or `libraryName`. Each imported type module receives the same options. External
Babel configuration is intentionally disabled: use a separate Babel loader for
additional syntax transforms, ordered so it does not strip Flow before this one.
Source maps and upstream maps are supported when enabled in Webpack.

Only declarations understood by `babel-plugin-flow-runtime` can be converted.
Opaque/ambient library declarations and dynamic imports may require a project
specific adapter; this loader does not invent validators for unavailable types.
Unresolved type dependencies and syntax errors fail the build rather than
silently weakening validation. Plain JavaScript exports with no matching type
export cannot provide a runtime validator.

Run `npm test` in this package for a real Webpack compilation that follows
transitive `.js.flow` imports, then accepts valid data and rejects invalid data.
