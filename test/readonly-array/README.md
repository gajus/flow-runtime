# Read-only array regression tests

Run `npm install --prefix test/readonly-array --workspaces=false`, then
`node test/readonly-array/run.cjs` from the repository root. The harness builds
the checked-out runtime and compiler sources in a temporary directory, using
the public CommonJS runtime entry point. It does not test a published package.

`--fixtures` additionally runs the existing compiler fixture matrix.
`--runtime` runs the runtime unit tests, excluding the separate runtime fixture
matrix (which needs the historical React build toolchain).
`--runtime-fixtures` includes that runtime fixture matrix, with the isolated
React and JSX dependencies declared in this test directory.
`FLOW_199_DEPS` can point to an existing dependency directory and
`FLOW_199_SOURCE` to an unchanged checkout for a baseline comparison.

Assertions return a shallow frozen snapshot. The caller's array remains
mutable, nested objects retain their identity, and later changes to the caller
are not reflected in the snapshot. Warning mode only validates and does not
freeze or copy. This is not a live view or deep immutability.

Checked variables, return values, direct identifier parameters and local aliases
retain the snapshot. This change does not recursively rewrite object properties,
destructuring bindings, imported alias parameters or nested arrays. Ordinary
array assertions continue to return the original array.
