# Assertions-disabled generic bindings

This source-build regression runner requires Node 20+ and the Babel 7 development
dependencies in this directory's package.json. Run `npm test` here; add
`node run.js --fixtures` to include the existing variable-assertion compiler
fixtures. It builds this checkout's plugin, runtime and config parser into an
isolated temporary directory, then executes the actual transformed modules.
`node run.js --all-fixtures` also exercises the original full compiler fixture
matrix, including annotation, combined and custom-runtime modes when defined.

Coverage includes annotation-only generic let/var declarations, initialization,
reassignment, for-of, nested functions, const/destructuring controls, unchecked
primitive locals, both flags disabled, and preserved assertion/warning behavior.
No global runtime registration or mock compiler/runtime is used.

Build artifacts are retained for inspection; the runner does not recursively
delete dependency trees. `FLOW_180_SOURCE` can point at a separate original source
checkout for a baseline comparison, with the same installed test dependencies.

The tests target the current Babel 7 source implementation, not the issue's old
published 0.15.0 plugin. Passing these focused checks is not a full project,
historical Babel 6, Flow static-checker or browser compatibility claim. This
change does not disable warnings or checking when either is enabled, and does
not change type-alias or function annotation generation.

With the reused test dependencies used during development, the focused suite has
19 passes on Node 20 and 24. The broader 247-test matrix has 243 passes / 4 failures;
the independent original source baseline has 236 passes / 11 failures. The same
four existing compiler fixture failures appear in both runs, while seven new
execution regressions fail only on the original source. This is not a full-green
project or a fresh-dependency-install result.
