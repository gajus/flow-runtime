'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path'), Module = require('node:module');
const babel = require('@babel/core');
const root = process.env.FLOW_2_ROOT;
const runtime = require(path.join(root, 'node_modules/flow-runtime')).default;
const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;
function compile(source, options = {assert: true, annotate: false}) {
  const result = babel.transformSync('// @flow\n' + source, {
    filename: path.join(root, 'case.js'), babelrc: false, configFile: false,
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [[plugin, options], require.resolve('@babel/plugin-transform-modules-commonjs')]});
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js'); instance.paths = Module._nodeModulePaths(root);
  instance._compile(result.code, instance.filename);
  return instance.exports;
}
for (const [name, body] of [
  ['declaration', 'const value = 1;'],
  ['expression', 'Math.abs(-1);'],
  ['one-sided branch', 'if (false) return "ok";'],
  ['while may not run', 'while (false) return "ok";'],
  ['for-of may not run', 'for (const value of []) return "ok";'],
  ['switch may not match', 'switch (2) {case 1: return "ok";}'],
  ['try-finally may fall through', 'try {Math.abs(-1);} finally {Math.abs(-2);}'],
  ['nested return is not an outer return', 'function inner() {return "ok";} inner();']
]) test('nonempty fallthrough after ' + name + ' checks undefined', () => {
  const output = compile('export function foo(): string {' + body + '}');
  assert.throws(() => output.foo(), /must be a string/);
});
test('the already-fixed empty body remains checked', () => {
  assert.throws(() => compile('export function foo(): string {}').foo());
});
test('the actual returned branch still succeeds', () => {
  const output = compile('export function foo(flag): string {if (flag) return "ok";}');
  assert.equal(output.foo(true), 'ok'); assert.throws(() => output.foo(false));
});
test('both returning branches retain their values', () => {
  const output = compile('export function foo(flag): string {if (flag) return "yes"; else return "no";}');
  assert.equal(output.foo(true), 'yes'); assert.equal(output.foo(false), 'no');
});
test('existing explicit invalid returns remain rejected', () => {
  assert.throws(() => compile('export function foo(): string {return 1;}').foo());
});
test('a thrown application exception is not replaced by a tail assertion', () => {
  const output = compile('export function foo(error): string {throw error;}');
  const failure = new Error('application'); assert.throws(() => output.foo(failure), error => error === failure);
});
test('void and nullable fallthrough remain allowed', () => {
  assert.equal(compile('export function foo(): void {const value = 1;}').foo(), undefined);
  assert.equal(compile('export function foo(): ?string {const value = 1;}').foo(), undefined);
});
test('unannotated functions remain unchecked', () => {
  assert.equal(compile('export function foo() {const value = 1;}').foo(), undefined);
});
test('assertions disabled do not add fallthrough checks', () => {
  assert.equal(compile('export function foo(): string {const value = 1;}', {assert: false, annotate: true}).foo(), undefined);
});
test('warn mode warns and preserves the undefined result', () => {
  const warnings = [], old = runtime.emitWarningMessage;
  runtime.emitWarningMessage = message => warnings.push(message);
  try {
    const output = compile('export function foo(): string {const value = 1;}', {assert: false, warn: true, annotate: false});
    assert.equal(output.foo(), undefined); assert.equal(warnings.length, 1);
  } finally { runtime.emitWarningMessage = old; }
});
test('an async explicit return keeps its existing resolution behavior', async () => {
  assert.equal(await compile('export async function foo(): Promise<string> {return "ok";}').foo(), 'ok');
});
test('a generator explicit return keeps yield and completion values', () => {
  const iterator = compile('export function* foo(): Generator<number, string, void> {yield 1; return "ok";}').foo();
  assert.deepEqual(iterator.next(), {value: 1, done: false});
  assert.deepEqual(iterator.next(), {value: 'ok', done: true});
});
test('a synchronous Promise return keeps its existing resolution behavior', async () => {
  assert.equal(await compile('export function foo(): Promise<string> {return Promise.resolve("ok");}').foo(), 'ok');
});
if (process.env.FLOW_2_FIXTURES) {
  const helper = path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__');
  const fixtures = require(path.join(helper, 'fixtures')).default;
  const check = require(path.join(helper, 'testTransform')).default;
  for (const [name, fixture] of fixtures) {
    test('existing fixture ' + name, () => check(fixture.input, {assert: true, annotate: false}, fixture.expected, fixture.integration));
    for (const [mode, options] of [
      ['annotated', {assert: false, annotate: true}], ['combined', {assert: true, annotate: true}],
      ['customRuntime', {libraryName: './custom-flow-runtime'}]
    ]) if (fixture[mode]) test('existing fixture ' + mode + ' ' + name,
      () => check(fixture.input, options, fixture[mode], fixture.integration));
  }
}
