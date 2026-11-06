'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path');
const Module = require('node:module');
const legacyRequire = Module.createRequire(path.join(__dirname, 'legacy/package.json'));
const babel = require('@babel/core');
const legacy = process.env.FLOW_MAP_BABEL_VERSION === '6';
const root = process.env.FLOW_MAP_TEST_ROOT;
const runtime = require(path.join(root, 'node_modules/flow-runtime')).default;
const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;
const NativeMap = global.Map;
let PolyfillMap;
try {
  // Exercise the real core-js fallback without changing the application global.
  // The mutation is limited to this isolated test process and always restored.
  global.Map = undefined;
  const imported = legacy ? legacyRequire('babel-runtime/core-js/map') : require('@babel/runtime-corejs3/core-js-stable/map');
  PolyfillMap = imported.default || imported;
}
finally {
  global.Map = NativeMap;
}

function compile (source, polyfill = true) {
  const input = '// @flow\n// @flow-runtime assert, annotate\n' + source;
  const result = legacy ? legacyRequire('babel-core').transform(input, {
    filename: path.join(root, 'case.js'), babelrc: false,
    presets: [[legacyRequire.resolve('babel-preset-env'), {targets: {node: 'current'}}], legacyRequire.resolve('babel-preset-flow')],
    plugins: [
      legacyRequire.resolve('babel-plugin-transform-decorators-legacy'),
      [plugin, {assert: false, annotate: false}],
      ...(polyfill ? [legacyRequire.resolve('babel-plugin-transform-runtime')] : []),
      legacyRequire.resolve('babel-plugin-transform-class-properties')
    ]
  }) : babel.transformSync(input, {
    filename: path.join(root, 'case.js'), babelrc: false, configFile: false,
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [
      [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
      [plugin, {assert: false, annotate: false}],
      ...(polyfill ? [[require.resolve('@babel/plugin-transform-runtime'), {corejs: 3, regenerator: false}]] : []),
      [require.resolve('@babel/plugin-transform-class-properties'), {loose: true}],
      require.resolve('@babel/plugin-transform-modules-commonjs')
    ]
  });
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js');
  instance.paths = Module._nodeModulePaths(root);
  instance._compile(result.code, instance.filename);
  return {exports: instance.exports, code: result.code};
}

function makeClass () {
  return compile(`export default class Foo {
    bar: Map<string, number> = new Map([['hello', 1]]);
    getValue(name: string) {return this.bar.get(name);}
  }`);
}

test('the official core-js Map fallback has a distinct constructor', () => {
  assert.notEqual(PolyfillMap, NativeMap);
  assert.equal(new PolyfillMap() instanceof NativeMap, false);
  assert.equal(global.Map, NativeMap);
});

test('the actual transformed class accepts its own polyfilled Map', () => {
  const result = makeClass();
  assert.match(result.code, legacy ? /babel-runtime\/core-js\/map/ : /runtime-corejs3/);
  const instance = new result.exports.default();
  assert.ok(instance.bar instanceof PolyfillMap);
  assert.equal(instance.getValue('hello'), 1);
});

test('invalid Map keys and values remain rejected by property validation', () => {
  const Foo = makeClass().exports.default;
  const instance = new Foo();
  assert.throws(() => {instance.bar = new PolyfillMap([[123, 1]]);});
  assert.throws(() => {instance.bar = new PolyfillMap([['hello', 'bad']]);});
  assert.throws(() => {instance.bar = {};});
  instance.bar = new PolyfillMap([['hello', 2]]);
  assert.equal(instance.getValue('hello'), 2);
});

test('native registered Map is not globally changed', () => {
  makeClass();
  const type = runtime.ref('Map', runtime.string(), runtime.number());
  assert.ok(type.accepts(new NativeMap([['hello', 1]])));
  assert.equal(type.accepts(new NativeMap([['hello', 'bad']])), false);
  assert.equal(type.accepts(new PolyfillMap([['hello', 1]])), false);
});

test('constructor-bound Map retains accepts and diagnostic key/value checks', () => {
  const type = runtime.map(runtime.string(), runtime.number(), PolyfillMap);
  assert.ok(type.accepts(new PolyfillMap([['hello', 1]])));
  assert.equal(type.accepts(new PolyfillMap([[1, 1]])), false);
  assert.equal(type.accepts(new PolyfillMap([['hello', 'bad']])), false);
  assert.equal(type.accepts({}), false);
  assert.equal(type.accepts(new NativeMap([['hello', 1]])), false);
  assert.throws(() => type.assert(new PolyfillMap([[1, 1]])));
  assert.throws(() => type.assert(new PolyfillMap([['hello', 'bad']])));
});

test('binding one constructor does not overwrite a custom global predicate', () => {
  const original = runtime.getPredicate('Map');
  const custom = input => input instanceof NativeMap && input.size === 0;
  runtime.setPredicate('Map', custom);
  try {
    const bound = runtime.map(runtime.string(), runtime.number(), PolyfillMap);
    assert.ok(bound.accepts(new PolyfillMap([['hello', 1]])));
    assert.equal(runtime.getPredicate('Map'), custom);
    const ordinary = runtime.ref('Map', runtime.string(), runtime.number());
    assert.ok(ordinary.accepts(new NativeMap()));
    assert.equal(ordinary.accepts(new NativeMap([['hello', 1]])), false);
  }
  finally {
    runtime.setPredicate('Map', original);
  }
});

test('native Map factory defaults preserve registered validation', () => {
  const type = runtime.map(runtime.string(), runtime.number());
  assert.ok(type.accepts(new NativeMap([['hello', 1]])));
  assert.equal(type.accepts(new NativeMap([['hello', false]])), false);
  assert.throws(() => runtime.map(runtime.string(), runtime.number(), null), /constructor/);
});

test('a generic type parameter called Map is not treated as the global builtin', () => {
  const result = compile('export default function identity<Map>(value: Map): Map {return value;}');
  assert.equal(result.exports.default('hello'), 'hello');
  assert.equal(result.exports.default(42), 42);
});

test('the ordinary native Map class still works without transform-runtime', () => {
  const result = compile(`export default class Foo {bar: Map<string, number> = new Map([['hello', 1]]);}`, false);
  const instance = new result.exports.default();
  assert.equal(instance.bar.get('hello'), 1);
  assert.throws(() => {instance.bar = new NativeMap([['hello', false]]);});
});

for (const filename of ['typeAliases/builtins/map.js', 'typeAssertions/functions/multipleTypeParameters.js']) {
  test('existing compiler fixture: ' + filename, () => {
    const fixture = require(path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__/__fixtures__', filename));
    const verify = require(path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__/testTransform')).default;
    verify(fixture.input, {assert: true, annotate: false}, fixture.expected, fixture.integration);
  });
}

test('a locally shadowed Map class retains nominal class validation', () => {
  const result = compile(`class Map {value: number = 1;}
    export default class Foo {bar: Map = new Map();}`);
  assert.equal(new result.exports.default().bar.value, 1);
});
