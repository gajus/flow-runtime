'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const path = require('node:path');
const Module = require('node:module');
const babel = require('@babel/core');
const root = process.env.FLOW_113_ROOT;
const runtime = require(path.join(root, 'node_modules/flow-runtime')).default;
function context() {
  const t = runtime.createContext(), warnings = [];
  t.emitWarningMessage = message => warnings.push(message);
  return {t, warnings};
}

test('warn catches the real Shape object-type invariant and preserves identity', () => {
  const {t, warnings} = context(), input = {};
  assert.equal(t.warn(t.$shape(t.number()), input), input);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Can only \$Shape/);
});
test('assert still throws the same Shape invariant', () => {
  const {t} = context();
  assert.throws(() => t.assert(t.$shape(t.number()), {}), /Can only \$Shape/);
});
test('validate remains strict when called directly', () => {
  const {t} = context();
  assert.throws(() => t.validate(t.$shape(t.number()), {}), /Can only \$Shape/);
});
test('valid values do not emit a warning', () => {
  const {t, warnings} = context();
  assert.equal(t.warn(t.number(), 42), 42);
  assert.equal(warnings.length, 0);
});
test('ordinary invalid values keep their normal formatted warning', () => {
  const {t, warnings} = context();
  assert.equal(t.warn(t.number(), 'text'), 'text');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Expected: number/);
  assert.match(warnings[0], /Actual: string/);
});
for (const value of [new Error('constraint failed'), 'plain failure', null, undefined, Symbol('failed')]) {
  test('warn handles a constraint throwing ' + String(value), () => {
    const {t, warnings} = context();
    const type = t.refinement(t.number(), () => { throw value; });
    assert.equal(t.warn(type, 42), 42);
    assert.equal(warnings.length, 1);
    assert.equal(typeof warnings[0], 'string');
  });
}
test('warn survives an exception that cannot be converted to a string', () => {
  const {t, warnings} = context();
  const type = t.refinement(t.number(), () => {throw {toString() {throw new Error('coercion failed');}};});
  assert.equal(t.warn(type, 42), 42);
  assert.equal(warnings.length, 1);
  assert.equal(typeof warnings[0], 'string');
});
test('warning formatting exceptions become a warning too', () => {
  const {t, warnings} = context();
  t.typeOf = () => {throw new Error('format failed');};
  assert.equal(t.warn(t.number(), 'text'), 'text');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /format failed/);
});
test('mode warn dispatches check through the protected path', () => {
  const {t, warnings} = context(), input = {};
  t.mode = 'warn';
  assert.equal(t.check(t.$shape(t.number()), input), input);
  assert.equal(warnings.length, 1);
});
test('intentional custom warning hook exceptions are not swallowed or retried', () => {
  const {t} = context(), failure = new Error('hook failed');
  let calls = 0;
  t.emitWarningMessage = () => {calls++; throw failure;};
  assert.throws(() => t.warn(t.number(), 'text'), error => error === failure);
  assert.equal(calls, 1);
});
test('default logger still uses the flow-runtime prefix', () => {
  const t = runtime.createContext(), calls = [], old = console.warn;
  console.warn = (...args) => calls.push(args);
  try { t.warn(t.number(), 'text'); } finally { console.warn = old; }
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'flow-runtime:');
});
test('a custom hook throwing after a validation exception still propagates once', () => {
  const {t} = context(), failure = new Error('fallback hook failed');
  let calls = 0;
  t.emitWarningMessage = () => {calls++; throw failure;};
  assert.throws(() => t.warn(t.$shape(t.number()), {}), error => error === failure);
  assert.equal(calls, 1);
});
test('real Babel warning-mode output continues past the Shape invariant', () => {
  const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;
  const result = babel.transformSync('// @flow\ntype Model = $Shape<number>; export function read(x: Model) {return x;}', {
    filename: path.join(root, 'case.js'), babelrc: false, configFile: false,
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [[plugin, {assert: false, warn: true, annotate: false}], require.resolve('@babel/plugin-transform-modules-commonjs')]});
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js'); instance.paths = Module._nodeModulePaths(root);
  const warnings = [], old = runtime.emitWarningMessage;
  runtime.emitWarningMessage = message => warnings.push(message);
  try {
    instance._compile(result.code, instance.filename);
    const input = {};
    assert.equal(instance.exports.read(input), input);
    assert(warnings.length > 0);
  } finally { runtime.emitWarningMessage = old; }
});
if (process.env.FLOW_113_EXISTING) {
  const names = [];
  global.describe = (name, callback) => {names.push(name); try {callback();} finally {names.pop();}};
  global.it = (name, callback) => test(names.concat(name).join(' > '), callback);
  const directory = path.join(root, 'node_modules/flow-runtime/errorReporting/__tests__');
  require(path.join(directory, 'makeJSONError.test'));
  require(path.join(directory, 'makeTypeError.test'));
}
