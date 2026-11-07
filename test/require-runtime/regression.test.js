'use strict';
const assert = require('node:assert/strict'), {test} = require('node:test');
const path = require('node:path'), Module = require('node:module'), babel = require('@babel/core');
const root = process.env.FLOW_207_ROOT;
const plugin = require(path.join(root, 'node_modules/babel-plugin-flow-runtime')).default;
const runtime = require(path.join(root, 'node_modules/flow-runtime'));
function transform(source, options = {}, sourceType = 'module') {
  return babel.transformSync('// @flow\n' + source, {
    filename: path.join(root, 'case.js'), sourceType, babelrc: false, configFile: false,
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [[plugin, {assert: true, annotate: false, ...options}]], ast: true});
}
function execute(source, options, sourceType) {
  const result = transform(source, {useRequire: true, ...options}, sourceType);
  const instance = new Module(path.join(root, 'case.js'), module);
  instance.filename = path.join(root, 'case.js'); instance.paths = Module._nodeModulePaths(root);
  instance._compile(result.code, instance.filename);
  return instance.exports;
}
const user = 'type User = {id: number, name: string}; module.exports = User;';
test('require output executes without module conversion and validates values', () => {
  const type = execute(user);
  assert.equal(type.accepts({id: 1, name: 'Ada'}), true);
  assert.throws(() => type.assert({id: 'bad', name: 'Ada'}), /must be a number/);
});
test('default and explicit false preserve identical import output', () => {
  assert.equal(transform(user).code, transform(user, {useRequire: false}).code);
  assert.equal(transform(user).ast.program.body[0].type, 'ImportDeclaration');
});
test('require output has a single loader and no generated imports', () => {
  const body = transform(user, {useRequire: true}).ast.program.body;
  assert.equal(body.filter(node => node.type === 'ImportDeclaration').length, 0);
  const loaders = body.filter(node => node.type === 'VariableDeclaration' &&
    node.declarations.some(item => item.init && item.init.type === 'CallExpression' && item.init.callee.name === 'require'));
  assert.equal(loaders.length, 1); assert.equal(loaders[0].kind, 'const');
});
test('libraryName controls actual CommonJS resolution', () => {
  assert.equal(execute(user, {libraryName: 'custom-runtime'}).accepts({id: 1, name: 'Ada'}), true);
});
test('application t binding remains intact', () => {
  assert.deepEqual(execute('const t = "application"; type User = string; module.exports = [t, User.accepts("ok")];'), ['application', true]);
});
test('annotated function checks actual arguments', () => {
  const fn = execute('function double(value: number): number {return value * 2;} module.exports = double;');
  assert.equal(fn(2), 4); assert.throws(() => fn('2'), /must be a number/);
});
test('annotate-only retains annotations without assertions', () => {
  const fn = execute('function echo(value: number): number {return value;} module.exports = echo;', {assert: false, annotate: true});
  assert.equal(fn('unchanged'), 'unchanged'); assert.ok(runtime.typeOf(fn));
});
test('warn mode warns without throwing', () => {
  const warnings = [], old = runtime.emitWarningMessage;
  runtime.emitWarningMessage = message => warnings.push(message);
  try {
    const fn = execute('function check(value: number) {return value;} module.exports = check;', {assert: false, warn: true});
    assert.equal(fn('bad'), 'bad'); assert.equal(warnings.length, 1);
  } finally { runtime.emitWarningMessage = old; }
});
test('strict directive remains first and active', () => {
  const result = transform('"use strict"; type User = string; module.exports = User;', {useRequire: true});
  assert.equal(result.ast.program.directives[0].value.value, 'use strict');
  assert.equal(execute('"use strict"; type User = string; module.exports = function () {return this;};')(), undefined);
});
test('type-free files need no generated runtime', () => {
  assert.equal(transform('module.exports = 3;', {useRequire: true}).code.includes('require('), false);
});
test('user-authored runtime imports remain untouched', () => {
  const result = transform('import runtime from "flow-runtime"; type User = string;', {useRequire: true});
  assert.equal(result.ast.program.body.filter(node => node.type === 'ImportDeclaration').length, 1);
  assert.equal(result.code.includes('require('), false); assert.match(result.code, /runtime\.type/);
});
test('unrelated user imports are not converted', () => {
  const result = transform('import fs from "node:fs"; type User = string;', {useRequire: true});
  assert.equal(result.ast.program.body.filter(node => node.type === 'ImportDeclaration').length, 1);
  assert.match(result.code, /require\("flow-runtime"\)/);
});
test('top-level require shadowing is an actionable compile error', () => {
  assert.throws(() => transform('const require = () => null; type User = string;', {useRequire: true}), /useRequire.*require.*shadowed/);
});
test('nested require parameter does not shadow the top-level loader', () => {
  assert.equal(execute('function helper(require) {return require;} type User = string; module.exports = User;').accepts('ok'), true);
});
test('explicit script sourceType executes without a generated ESM import', () => {
  assert.equal(execute(user, {}, 'script').accepts({id: 1, name: 'Ada'}), true);
});
if (process.env.FLOW_207_FIXTURES) {
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
