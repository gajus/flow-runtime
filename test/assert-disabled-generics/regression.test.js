'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path');
const Module = require('node:module');
const babel = require('@babel/core');
const root = process.env.FLOW_180_ROOT;
const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;

function compile(source, options = {assert: false, annotate: true}) {
  const result = babel.transformSync('// @flow\n' + source, {
    filename: path.join(root, 'case.js'), babelrc: false, configFile: false,
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [[plugin, options], require.resolve('@babel/plugin-transform-modules-commonjs')]
  });
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js');
  instance.paths = Module._nodeModulePaths(root);
  instance._compile(result.code, instance.filename);
  return {exports: instance.exports, code: result.code};
}

for (const [name, input, expected] of [
  ['uninitialized let', 'export function foo<X>() {let bar: X; return bar;}', undefined],
  ['uninitialized var', 'export function foo<X>() {var bar: X; return bar;}', undefined],
  ['initialized mutable local', 'export function foo<X>(x: X) {let bar: X = x; bar = x; return bar;}', 42],
  ['const control', 'export function foo<X>(x: X) {const bar: X = x; return bar;}', 42],
  ['generic for-of', 'export function foo<X>(xs: Array<X>) {for (let bar: X of xs) {return bar;}}', 42],
  ['nested generic', 'export function foo<X>(x: X) {function inner<Y>(y: Y) {let a: X = x; let b: Y = y; return [a,b];} return inner(x);}', [42,42]],
  ['destructuring control', 'export function foo<X>(xs: Array<X>) {let [bar]: Array<X> = xs; return bar;}', 42]
]) {
  test('annotation-only ' + name + ' executes without undefined generic bindings', () => {
    const output = compile(input);
    assert.deepEqual(output.exports.foo(name.includes('for-of') || name.includes('destructuring') ? [42] : 42), expected);
  });
}

test('assert and annotate both disabled leave reassignment unchecked', () => {
  const output = compile('export function foo<X>(x: X) {let bar: X = x; bar = 123; return bar;}', {assert: false, annotate: false});
  assert.equal(output.exports.foo('text'), 123);
});

test('annotation-only primitive locals remain unchecked', () => {
  const output = compile('export function foo() {let bar: number = "text"; return bar;}');
  assert.equal(output.exports.foo(), 'text');
});

test('annotation-only functions retain runtime type metadata', () => {
  const runtime = require(path.join(root, 'node_modules/flow-runtime')).default;
  const output = compile('export function foo<X>(x: X): X {let bar: X = x; return bar;}');
  assert.equal(output.exports.foo(42), 42);
  assert(runtime.getAnnotation(output.exports.foo));
});

test('assert mode still rejects a wrong reassignment', () => {
  const output = compile('export function foo() {let bar: number = 1; bar = "text"; return bar;}', {assert: true, annotate: false});
  assert.throws(() => output.exports.foo());
});

test('warning mode still reports a wrong reassignment without throwing', () => {
  const warnings = [];
  const old = console.warn;
  console.warn = (...args) => warnings.push(args);
  try {
    const output = compile('export function foo() {let bar: number = 1; bar = "text"; return bar;}', {assert: false, warn: true, annotate: false});
    assert.equal(output.exports.foo(), 'text');
    assert(warnings.length > 0);
  } finally { console.warn = old; }
});

if (process.env.FLOW_180_FIXTURES) {
  const helper = path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__');
  const fixtures = require(path.join(helper, 'fixtures')).default;
  const check = require(path.join(helper, 'testTransform')).default;
  for (const [name, fixture] of fixtures) {
    if (process.env.FLOW_180_FIXTURES !== 'all' && !name.replace(/\\/g, '/').startsWith('typeAssertions/variables/')) continue;
    test('existing compiler fixture ' + name, () => check(fixture.input, {assert: true, annotate: false}, fixture.expected, fixture.integration));
    if (process.env.FLOW_180_FIXTURES === 'all') {
      for (const [mode, options] of [
        ['annotated', {assert: false, annotate: true}],
        ['combined', {assert: true, annotate: true}],
        ['customRuntime', {libraryName: './custom-flow-runtime'}]
      ]) {
        if (fixture[mode]) test('existing compiler fixture ' + mode + ' ' + name,
          () => check(fixture.input, options, fixture[mode], fixture.integration));
      }
    }
  }
}
