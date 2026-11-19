'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const project = process.env.FLOW_199_SOURCE || path.resolve(__dirname, '../..');
const deps = process.env.FLOW_199_DEPS || path.join(__dirname, 'node_modules');
const load = Module.createRequire(path.join(deps, '../package.json'));
const babel = load('@babel/core');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-readonly-199-'));
process.env.NODE_PATH = [path.join(root, 'node_modules'), deps].join(path.delimiter);
Module._initPaths();
function build(source, target, includeTests = false) {
  fs.mkdirSync(target, {recursive: true});
  for (const entry of fs.readdirSync(source, {withFileTypes: true})) {
    if (includeTests && source.includes('flow-runtime') && !source.includes('babel-plugin-flow-runtime') &&
        (entry.name === '__fixtures__' || entry.name === 'fixtures.test.js')) continue;
    if (!includeTests && (entry.name.startsWith('__') || entry.name.endsWith('.test.js'))) continue;
    const input = path.join(source, entry.name), output = path.join(target, entry.name);
    if (entry.isDirectory()) build(input, output, includeTests);
    else if (entry.name.endsWith('.js')) {
      const result = babel.transformFileSync(input, {babelrc: false, configFile: false,
        presets: [load.resolve('@babel/preset-flow')],
        plugins: [
          ...(includeTests ? [[load.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
            [load.resolve('@babel/plugin-transform-class-properties'), {loose: true}]] : []),
          load.resolve('@babel/plugin-transform-modules-commonjs')]});
      fs.writeFileSync(output, result.code);
    }
  }
}
for (const name of ['flow-config-parser', 'flow-runtime', 'babel-plugin-flow-runtime']) {
  const target = path.join(root, 'node_modules', name);
  build(path.join(project, 'packages', name, 'src'), target);
  if (name === 'flow-runtime') fs.writeFileSync(path.join(target, 'commonjs.js'), "module.exports = require('./index.cjs').default;\n");
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({name,
    main: name === 'flow-config-parser' ? 'flowConfigParser.js' : name === 'flow-runtime' ? 'commonjs.js' : 'index.js'}));
}
const runtime = require(path.join(root, 'node_modules/flow-runtime'));
const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;
function execute(source, warn = false) {
  const first = babel.transformSync('// @flow\n' + source, {filename: path.join(root, 'case.js'),
    babelrc: false, configFile: false, parserOpts: {plugins: ['flow', 'classProperties']},
    plugins: [[plugin, {assert: !warn, warn, annotate: false}]]});
  const result = babel.transformSync(first.code, {babelrc: false, configFile: false,
    presets: [load.resolve('@babel/preset-flow')], plugins: [load.resolve('@babel/plugin-transform-modules-commonjs')]});
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js'); instance.paths = Module._nodeModulePaths(root);
  instance._compile(result.code, instance.filename);
  return instance.exports;
}
const cases = [
  ['runtime validates arrays and elements', () => {
    const type = runtime.ref('$ReadOnlyArray', runtime.number());
    assert(type.accepts([])); assert(type.accepts([1]));
    assert(!type.accepts({})); assert(!type.accepts(['bad']));
  }],
  ['assert makes a frozen shallow copy, not a frozen caller', () => {
    const type = runtime.ref('$ReadOnlyArray', runtime.any());
    const item = {}, input = [item], output = type.assert(input);
    assert.notEqual(output, input); assert(Array.isArray(output)); assert(Object.isFrozen(output));
    assert.equal(output[0], item); assert(!Object.isFrozen(item));
    assert.throws(() => output.push(2), TypeError); input.push(2); assert.equal(output.length, 1);
  }],
  ['warn keeps mutable input identity', () => {
    const input = [1], type = runtime.ref('$ReadOnlyArray', runtime.number());
    assert.equal(runtime.warn(type, input), input); input.push(2); assert(!Object.isFrozen(input));
  }],
  ['compiled variable validates and freezes', () => {
    const output = execute('const a: $ReadOnlyArray<number> = [1]; module.exports = a;');
    assert(Object.isFrozen(output));
    assert.throws(() => execute('const a: $ReadOnlyArray<number> = ["bad"];'));
  }],
  ['compiled parameter retains the transformed value', () => {
    const fn = execute('module.exports = function(a: $ReadOnlyArray<number>) { return a; };');
    const input = [1], output = fn(input);
    assert.notEqual(output, input); assert(Object.isFrozen(output)); input.push(2);
  }],
  ['local alias parameter and return work', () => {
    const fn = execute('type List = $ReadOnlyArray<number>; module.exports = function(a: List): List { return a; };');
    const output = fn([1]); assert(Object.isFrozen(output));
  }],
  ['warn parameter remains writable', () => {
    const fn = execute('module.exports = function(a: $ReadOnlyArray<number>) { a.push(2); return a; };', true);
    const input = [1]; assert.equal(fn(input), input); assert.deepEqual(input, [1, 2]);
  }],
  ['ordinary array parameter preserves identity', () => {
    const fn = execute('module.exports = function(a: Array<number>) { return a; };');
    const input = [1]; assert.equal(fn(input), input); assert(!Object.isFrozen(input));
  }],
  ['context assert freezes and validation failure leaves input untouched', () => {
    const type = runtime.ref('$ReadOnlyArray', runtime.number());
    assert(Object.isFrozen(runtime.assert(type, [1])));
    const invalid = ['bad']; assert.throws(() => type.assert(invalid));
    assert(!Object.isFrozen(invalid));
  }],
  ['nullable, optional and union parameters retain their semantics', () => {
    const nullable = execute('module.exports = function(a: ?$ReadOnlyArray<number>) { return a; };');
    assert.equal(nullable(null), null); assert.equal(nullable(undefined), undefined);
    assert(Object.isFrozen(nullable([1])));
    const optional = execute('module.exports = function(a?: $ReadOnlyArray<number>) { return a; };');
    assert.equal(optional(), undefined); assert(Object.isFrozen(optional([1])));
    const union = execute('module.exports = function(a: string | $ReadOnlyArray<number>) { return a; };');
    assert.equal(union('ok'), 'ok'); assert(Object.isFrozen(union([1])));
    assert.throws(() => union([false]));
  }],
  ['forward and transitive local aliases retain the assertion result', () => {
    const fn = execute('module.exports = function(a: List) { return a; }; type List = Other; type Other = $ReadOnlyArray<number>;');
    assert(Object.isFrozen(fn([1])));
  }],
  ['ordinary scalar, object and alias assertions preserve identity', () => {
    const object = {}, type = runtime.object();
    assert.equal(type.assert(object), object); assert.equal(runtime.assert(type, object), object);
    assert.equal(runtime.number().assert(2), 2);
    const fn = execute('type List = Array<number>; module.exports = function(a: List) { return a; };');
    const input = [1]; assert.equal(fn(input), input);
  }],
  ['return-only annotation freezes the returned copy', () => {
    const fn = execute('module.exports = function(a): $ReadOnlyArray<number> { return a; };');
    const input = [1]; assert(Object.isFrozen(fn(input))); assert(!Object.isFrozen(input));
  }],
  ['mixed elements, frozen inputs and mutation methods are checked', () => {
    const type = runtime.ref('$ReadOnlyArray', runtime.union(runtime.string(), runtime.number()));
    assert(type.accepts(['one', 2])); assert(!type.accepts([false]));
    const input = Object.freeze(['one', 2]), output = type.assert(input);
    assert.notEqual(input, output); assert.deepEqual(input, output);
    assert.throws(() => output.splice(0, 1), TypeError);
    assert.throws(() => { output[0] = 'two'; }, TypeError);
  }],
  ['nullable aliases and default parameters retain null or checked arrays', () => {
    const fn = execute('type List = ?$ReadOnlyArray<number>; module.exports = function(a: List) { return a; };');
    assert.equal(fn(null), null); assert.equal(fn(undefined), undefined); assert(Object.isFrozen(fn([1])));
    const defaults = execute('module.exports = function(a: $ReadOnlyArray<number> = [1]) { return a; };');
    assert(Object.isFrozen(defaults()));
  }],
  ['parameter reassignment remains checked', () => {
    const fn = execute('module.exports = function(a: $ReadOnlyArray<number>) { a = [2]; return a; };');
    assert.deepEqual(fn([1]), [2]); assert(Object.isFrozen(fn([1])));
    const invalid = execute('module.exports = function(a: $ReadOnlyArray<number>) { a = [false]; return a; };');
    assert.throws(() => invalid([1]));
  }],
];
let failed = 0;
for (const [name, run] of cases) {
  try { run(); console.log('PASS ' + name); }
  catch (error) { failed++; console.log('FAIL ' + name + ': ' + error.stack); }
}
console.log(JSON.stringify({passed: cases.length - failed, failed}));
if (process.argv.includes('--fixtures')) {
  const target = path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__');
  build(path.join(project, 'packages/babel-plugin-flow-runtime/src/__tests__'), target, true);
  const fixtures = require(path.join(target, 'fixtures')).default;
  const check = require(path.join(target, 'testTransform')).default;
  let passed = 0, fixtureFailed = 0;
  for (const [name, fixture] of fixtures) {
    for (const [mode, options] of [
      ['expected', {assert: true, annotate: false}],
      ['annotated', {assert: false, annotate: true}],
      ['combined', {assert: true, annotate: true}],
      ['customRuntime', {libraryName: './custom-flow-runtime'}]
    ]) {
      if (!fixture[mode]) continue;
      try { check(fixture.input, options, fixture[mode], fixture.integration); passed++; }
      catch (error) { fixtureFailed++; console.log('FIXTURE FAIL ' + name + '/' + mode + ': ' + error.message.slice(0, 180)); }
    }
  }
  failed += fixtureFailed;
  console.log(JSON.stringify({fixturePassed: passed, fixtureFailed}));
}
process.exitCode = failed ? 1 : 0;
if (process.argv.includes('--runtime')) {
  const target = path.join(root, 'node_modules/flow-runtime');
  build(path.join(project, 'packages/flow-runtime/src'), target, true);
  const Mocha = load('mocha');
  const mocha = new Mocha({reporter: 'dot'});
  function addTests(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) addTests(filename);
      else if (entry.name.endsWith('.test.js')) mocha.addFile(filename);
    }
  }
  addTests(target);
  mocha.run(failures => { process.exitCode = failures || failed ? 1 : 0; });
}
