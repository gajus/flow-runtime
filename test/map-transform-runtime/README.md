# Map / transform-runtime regression

From this directory, use Node 18+:

```sh
npm install --ignore-scripts --workspaces=false --package-lock=false
npm test
```

The runner builds current production converter/runtime/config-parser sources
with Babel Flow removal and CommonJS conversion into a private temporary
directory. It then runs real Babel 7 transformations with legacy decorators,
class fields and `transform-runtime` using the official core-js 3 pure Map.
To exercise the fallback on modern Node, the isolated child temporarily
removes its own global Map while loading that official polyfill and restores
the global in `finally`. It does not change application/global user state.

The original failure is reproduced on the unmodified source: the transformed
class constructs a polyfill Map, but its string-named validator selects the
registered native Map. The result is `Expected: Map / Actual: Map`.

## Fix

The converter emits `t.map(keyType, valueType, Map)` for an unshadowed global
Map annotation. Babel can rewrite this actual constructor reference together
with the value's `new Map()` expression. The new runtime factory binds that
constructor to a fresh instance of the existing registered Map validator.
It does not change the global Map predicate/registration and retains key and
value validation in both `accepts()` and diagnostic `assert()` paths.

Native Map is the factory's default constructor. This converter output needs
the matching updated runtime source; older published runtimes do not have
the new `map()` factory. Qualified/imported types, local Map classes and type
parameters are not mapped to the global builtin factory.

## Known Baseline Failure

The full regression file deliberately includes a failing characterization:
a generated type parameter called `Map` is itself rewritten by
`transform-runtime`, so `flowInto()` receives the polyfill constructor instead
of a type parameter. This fails on both the unchanged base and this branch.
It is not skipped or claimed fixed by the class-property change.

For an explicitly selected focused run, use `npm run test:focused`. The runner
uses a positive list of relevant case names; it does not mark the baseline
failure as passing. To compare with an unchanged
checkout, set `FLOW_MAP_SOURCE_PROJECT` to its absolute path and select a
test name. These are explicit selections, not full-suite success.

This runner checks current source API behavior, not the official Rollup build,
all monorepo tests, every Babel/core-js version, or the original Babel 6
toolchain. Two existing compiler fixtures are exercised through their original
comparison helper, with the expected Map output updated for the new factory.
