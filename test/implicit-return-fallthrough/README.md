# Ordinary-function fallthrough returns

Run `npm test` here with Node 20+ and the listed Babel development dependencies.
`node run.js --fixtures` also runs the original compiler fixture matrix, including
annotation, combined and custom-runtime variants when defined. Actual source
plugin/runtime/config-parser packages are built into an isolated directory and
the transformed output is executed, not mocked.

PR249 already fixed empty function bodies. This regression concerns its remaining
non-empty-body guard: negating a string before comparing it to `ReturnStatement`
always evaluates false. Use the existing Babel predicate instead. A tail check
only executes if JavaScript control actually reaches the end; earlier returns
or thrown application exceptions retain their behavior.

The focused cases cover declarations, expressions, conditional/loop/switch/try
fallthrough, nested functions, explicit returns, empty bodies, allowed undefined,
disabled assertions and warnings. Existing async, generator and synchronous
Promise explicit-return paths are controls, not a claim to implement every
implicit return in those separate conversion paths. This change is deliberately
limited to the current ordinary-function branch containing the broken guard.

`FLOW_2_SOURCE` can select a separate original checkout for baseline comparison.
Artifacts are retained for inspection without recursive deletion of dependency
trees. Node 20 is a standalone-test requirement, not a new plugin runtime floor.
Passing this runner is not a full monorepo, ESLint/Flow, historical Babel 6 or
published-version compatibility result.

The original source reproduces 10 focused failures out of 20; the fix passes all
20 on Node 20 and 24. The full 255-case matrix gives 251 passes / 4 failures versus
241 passes / 14 failures on an independent original checkout. The same four
pre-existing compiler fixture failures remain, not a full-green project result.
An initial guard-only correction also changed a non-generic generator fixture;
the final condition explicitly preserves existing non-empty async/generator paths.
