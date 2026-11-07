# Optional CommonJS Runtime Loading

Run `npm install` in this directory, then `npm test` with Node 20 or newer.
Use `node run.js --fixtures` to also run the existing compiler fixture matrix.
Set `FLOW_207_SOURCE` to an independent original checkout to compare the same tests.

The runner builds the actual current plugin and runtime source in a retained
temporary directory. Babel strips Flow and converts the library sources to CJS;
the program under test uses only the Flow preset and runtime plugin, with no
module-transform plugin. A packaging adapter selects the actual `index.cjs.js`
entry's default export, matching the published CJS API; it is not a mock runtime
or a validation replacement. A custom runtime module re-exports that same object.

The tests cover validation, argument checking, annotation-only and warning modes,
custom runtime names, default import compatibility, user imports, binding
collisions and strict directives. This option only controls generated runtime
loading. It does not turn arbitrary ESM input into CommonJS or deduplicate a
user-authored require declaration. Top-level require shadowing is rejected.

The Node 20+ requirement is for this standalone node:test harness, not a change
to the runtime's supported Node versions. Full Lerna, lint, Flow, historical
Babel 6, browser and clean-install verification are separate checks.

Verified with reused installed Babel 7 dependencies: 15 focused cases pass on
Node 20.19.5 and 24.3.0. Node 20 expanded matrix: 246 pass, 4 fail out of 250;
the same suite against an independent original a9b7e1d checkout: 234 pass,
16 fail. All four remaining failures are also in the original:
bugs/14-exportDefaultArrowFunction, bugs/254-import-type-conversion,
patternMatching/functionObjectPatternWithAnnotation and
patternMatching/functionWithComplexPattern. The complete matrix is not green.
