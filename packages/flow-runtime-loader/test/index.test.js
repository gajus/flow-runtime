'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {it: test, after} = require('mocha');
const rimraf = require('rimraf');
const webpack = require('webpack');
const loader = require('../');
const loaderPath = require.resolve('../');
const runtimePath = require.resolve('flow-runtime');
const dependencies = path.dirname(path.dirname(require.resolve('draft-js/package.json')));
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-runtime-loader-tests-'));
let sequence = 0;

after(function cleanupFixtures() {
  const resolved = fs.realpathSync(root);
  assert.strictEqual(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
  assert(path.basename(resolved).startsWith('flow-runtime-loader-tests-'));
  rimraf.sync(resolved);
});

function project(files) {
  const directory = path.join(root, String(++sequence));
  fs.mkdirSync(directory);
  for (const name of Object.keys(files)) {
    const file = path.join(directory, name);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, files[name]);
  }
  return directory;
}

function configuration(directory, overrides) {
  const config = {
    mode: 'development', target: 'node', context: directory, entry: './entry.js',
    output: {path: path.join(directory, 'dist'), filename: 'bundle.js', libraryTarget: 'commonjs2'},
    devtool: 'source-map',
    resolve: {modules: [dependencies, 'node_modules'], alias: {'flow-runtime': runtimePath}},
    resolveLoader: {alias: {'flow-runtime-loader': loaderPath}}
  };
  return Object.assign(config, overrides);
}

function compile(directory, overrides) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(configuration(directory, overrides));
    compiler.run((error, stats) => {
      const complete = () => {
        if (error) return reject(error);
        if (stats.hasErrors()) return reject(new Error(stats.toString({all: false, errors: true})));
        const file = path.join(directory, 'dist', 'bundle.js');
        delete require.cache[file];
        resolve({module: require(file), stats, file});
      };
      if (compiler.close) compiler.close(complete); else complete();
    });
  });
}

function direct(source, overrides, inputMap) {
  return new Promise((resolve, reject) => {
    const context = Object.assign({
      resourcePath: path.join(root, 'direct.js.flow'), sourceMap: true,
      cacheable() { this.wasCacheable = true; }, getOptions: () => ({}),
      async() { return (error, code, map) => error ? reject(error) : resolve({code, map, cached: context.wasCacheable}); },
      resolve() { throw new Error('No import is expected in this fixture'); },
      addDependency() {}
    }, overrides);
    loader.call(context, source, inputMap);
  });
}

test('the exact DraftJS inline import exposes a real validator and rejects invalid nested data', async () => {
  const directory = project({
    'entry.js': "import t from 'flow-runtime'; import {RawDraftContentState} from 'flow-runtime-loader!draft-js/lib/RawDraftContentState.js.flow'; export const validator = RawDraftContentState; export const check = value => t.param('body', RawDraftContentState).assert(value);"
  });
  const result = await compile(directory);
  const document = {blocks: [{key: 'a', text: 'hello', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {}}], entityMap: {}};
  assert.strictEqual(typeof result.module.validator.assert, 'function');
  assert.strictEqual(result.module.check(document), document);
  assert.throws(() => result.module.check({blocks: 'wrong', entityMap: {}}));
  assert.throws(() => result.module.check({blocks: [{...document.blocks[0], depth: 'wrong'}], entityMap: {}}), /number/);
  assert.throws(() => result.module.check({...document, entityMap: {'0': {type: 'LINK', mutability: 42, data: {}}}}));
  const draft = require.resolve('draft-js/lib/RawDraftContentState.js.flow');
  assert(result.stats.compilation.fileDependencies.has(draft));
});

test('type-only dependencies recurse while mixed value imports use the actual JS module', async () => {
  const directory = project({
    'model.js': 'export const marker = "actual-value";',
    'model.js.flow': 'export type Model = {id: number};',
    'item.js.flow': 'import type {Model} from "./model"; export type Item = {model: Model, label: string};',
    'record.js.flow': 'import {type Model, marker} from "./model"; import type {Item} from "./item"; export type Record = {model: Model, items: Array<Item>}; export const valueMarker = marker;',
    'entry.js': 'export {Record, valueMarker} from "flow-runtime-loader!./record.js.flow";'
  });
  const {module, stats} = await compile(directory);
  const value = {model: {id: 1}, items: [{model: {id: 2}, label: 'ok'}]};
  assert.strictEqual(module.valueMarker, 'actual-value');
  assert.strictEqual(module.Record.assert(value), value);
  assert.throws(() => module.Record.assert({...value, model: {id: 'bad'}}), /number/);
  assert.throws(() => module.Record.assert({...value, items: [{model: {id: 2}, label: 4}]}), /string/);
  assert(stats.compilation.fileDependencies.has(path.join(directory, 'model.js.flow')));
  assert(stats.compilation.fileDependencies.has(path.join(directory, 'item.js.flow')));
});

test('webpack aliases resolve a real module and prefer its declaration stub', async () => {
  const directory = project({
    'model.js': 'export const marker = "JS";',
    'model.js.flow': 'export type Model = {id: number};',
    'types.js.flow': 'import type {Model} from "Model"; export type Value = {model: Model};',
    'entry.js': 'export {Value} from "flow-runtime-loader!./types.js.flow";'
  });
  const {module} = await compile(directory, {resolve: {alias: {'flow-runtime': runtimePath, 'Model$': path.join(directory, 'model.js')}}});
  assert.throws(() => module.Value.assert({model: {id: 'bad'}}), /number/);
  const good = {model: {id: 1}};
  assert.strictEqual(module.Value.assert(good), good);
});

test('type re-exports load declaration-only relative modules', async () => {
  const directory = project({
    'leaf.js.flow': 'export type Leaf = {name: string};',
    'types.js.flow': 'export type {Leaf} from "./leaf";',
    'entry.js': 'export {Leaf} from "flow-runtime-loader!./types.js.flow";'
  });
  const {module} = await compile(directory);
  const good = {name: 'ok'};
  assert.strictEqual(module.Leaf.assert(good), good);
  assert.throws(() => module.Leaf.assert({name: false}), /string/);
});

test('circular type imports remain lazy runtime references', async () => {
  const directory = project({
    'a.js.flow': 'import type {B} from "./b"; export type A = {b?: B};',
    'b.js.flow': 'import type {A} from "./a"; export type B = {a?: A};',
    'entry.js': 'export {A} from "flow-runtime-loader!./a.js.flow";'
  });
  const {module} = await compile(directory);
  const good = {b: {a: {}}};
  assert.strictEqual(module.A.assert(good), good);
  assert.throws(() => module.A.assert({b: 12}));
});

test('webpack rules preserve options through dependencies without repeating the loader', async () => {
  const directory = project({
    'leaf.js.flow': 'export type Leaf = {id: number};',
    'types.js.flow': 'import type {Leaf} from "./leaf"; export type Value = {leaf: Leaf};',
    'entry.js': 'export {Value} from "./types.js.flow";'
  });
  const {module} = await compile(directory, {
    resolve: {alias: {validationRuntime: runtimePath}},
    module: {rules: [{test: /\.js\.flow$/, use: [{loader: loaderPath, options: {libraryName: 'validationRuntime', annotate: false, marker: '!?#'}}]}]}
  });
  const good = {leaf: {id: 1}};
  assert.strictEqual(module.Value.assert(good), good);
  assert.throws(() => module.Value.assert({leaf: {id: 'bad'}}), /number/);
});

test('loader source maps compose the supplied original mapping', async () => {
  const original = 'export type Count = number;';
  const result = await direct(original, {}, {version: 3, sources: ['original.flow'], sourcesContent: [original], names: [], mappings: 'AAAA'});
  assert.strictEqual(result.cached, true);
  assert(result.map.sources.some(name => name.endsWith('original.flow')));
  assert(result.map.sourcesContent.includes(original));
  assert(result.map.mappings.length > 0);
});

test('Buffer input, legacy options and disabled source maps produce exported runtime types', async () => {
  const result = await direct(Buffer.from('export type Count = number;'), {sourceMap: false, getOptions: undefined, query: '?libraryName=validationRuntime&annotate=false'});
  assert.strictEqual(result.map, null);
  assert(result.code.includes('validationRuntime'));
  assert(result.code.includes('export const Count'));
  assert(!result.code.includes('export type'));
});

test('invalid Flow syntax reaches the webpack loader error channel', async () => {
  const directory = project({'types.js.flow': 'export type Broken = ;', 'entry.js': 'export {Broken} from "flow-runtime-loader!./types.js.flow";'});
  await assert.rejects(compile(directory), /SyntaxError|Unexpected token/);
});

test('an unresolved declaration dependency makes the real webpack build fail', async () => {
  const directory = project({'types.js.flow': 'import type {Missing} from "./absent"; export type Value = Missing;', 'entry.js': 'export {Value} from "flow-runtime-loader!./types.js.flow";'});
  await assert.rejects(compile(directory), /absent/);
});

test('a disabled webpack alias is rejected instead of silently removing validation', async () => {
  const directory = project({'types.js.flow': 'import type {Missing} from "Disabled"; export type Value = Missing;', 'entry.js': 'export {Value} from "flow-runtime-loader!./types.js.flow";'});
  await assert.rejects(compile(directory, {resolve: {alias: {Disabled: false, 'flow-runtime': runtimePath}}}), /disabled or not a file/);
});

test('unsupported resource delimiters propagate an explicit error', async () => {
  await assert.rejects(direct('import type {Value} from "./value"; export type Result = Value;', {
    resolve: (directory, request, callback) => callback(null, path.join(root, 'bad!name.js.flow'))
  }), /Cannot represent a type module path/);
});
