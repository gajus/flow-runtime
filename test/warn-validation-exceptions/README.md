# Warning-mode validation exceptions

Run `npm test` from this directory with Node 20+ and the listed Babel development
dependencies installed. `node run.js --existing` also includes the original
makeJSONError/makeTypeError tests. The runner builds this checkout's actual
runtime, compiler and config-parser source, then executes runtime calls and a
real Babel warning-mode program. It does not substitute a mocked runtime.

Cases cover the real `$Shape` invariant, custom constraints throwing Error or
non-Error values, hostile string conversion, warning formatting failure, normal
validation, input identity, mode dispatch, default logging and custom warning
hooks. `assert` and direct `validate` remain strict. Exceptions intentionally
thrown by a custom warning hook still propagate; the hook is outside the
validation catch, not silently retried or swallowed.

The fallback warning means validation could not complete, not that the input is
valid. It does not repair invalid type definitions or promise to suppress user
logger failures. No input mutation or automatic retry is added.

`FLOW_113_SOURCE` can select a separate original checkout for baseline comparison.
Build artifacts are retained for inspection without recursively deleting linked
dependencies. Node 20 is a test-runner requirement, not a new runtime requirement
for the library. This is not a full monorepo, historical Babel 6/0.12, Flow static
checker or browser compatibility claim.
