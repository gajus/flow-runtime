'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {test} = require('node:test');
const webpack = require(process.env.WEBPACK_VERSION === '4' ? 'webpack4' : 'webpack');

const loader = path.resolve(__dirname, '..', 'index.js');

async function bundle (files, subject, verify, options = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'flow-runtime-loader-'));
  let compiler;
  try {
    const {useRule, ...configuration} = typeof options === 'function' ? options(root) : options;
    for (const [name, content] of Object.entries(files)) {
      const target = path.join(root, name);
      await fs.mkdir(path.dirname(target), {recursive: true});
      await fs.writeFile(target, content);
    }
    await fs.writeFile(path.join(root, 'entry.js'),
      'module.exports = require(' + JSON.stringify(useRule ? subject : '!!' + loader + '!' + subject) + ');');
    compiler = webpack({
      mode: 'none',
      target: 'node',
      context: root,
      entry: './entry.js',
      output: {path: path.join(root, 'out'), filename: 'bundle.js', libraryTarget: 'commonjs2'},
      devtool: 'source-map',
      externals: {'flow-runtime': 'commonjs ' + require.resolve('flow-runtime')},
      ...configuration
    });
    const stats = await new Promise((accept, reject) => {
      compiler.run((error, result) => error ? reject(error) : accept(result));
    });
    if (stats.hasErrors()) {
      throw new Error(stats.toString({all: false, errors: true}));
    }
    await verify(require(path.join(root, 'out', 'bundle.js')), stats, root);
  }
  finally {
    if (compiler && compiler.close) await new Promise((accept, reject) => compiler.close(error => error ? reject(error) : accept()));
    assert.equal(path.dirname(root), os.tmpdir());
    assert.ok(path.basename(root).startsWith('flow-runtime-loader-'));
    await fs.rm(root, {recursive: true, force: true});
  }
}

test('exports validators for a Flow alias', async () => {
  await bundle({'model.js.flow': 'export type Model = {name: string, count: number};'}, './model.js.flow', result => {
    assert.ok(result.Model.accepts({name: 'Alice', count: 2}));
    assert.equal(result.Model.accepts({name: 'Alice', count: 'bad'}), false);
    assert.throws(() => result.Model.assert({}), /name/);
  });
});

test('recursively transforms imported declaration types and tracks them', async () => {
  await bundle({
    'model.js.flow': "import type {Person} from './person'; export type Model = {owner: Person};",
    'person.js.flow': "import type {Name} from './name'; export type Person = {name: Name};",
    'person.js': 'throw new Error("runtime companion must not execute");',
    'name.js.flow': 'export type Name = string;'
  }, './model.js.flow', (result, stats, root) => {
    assert.ok(result.Model.accepts({owner: {name: 'Alice'}}));
    assert.equal(result.Model.accepts({owner: {name: 3}}), false);
    assert.ok(stats.compilation.fileDependencies.has(path.join(root, 'person.js.flow')));
    assert.ok(stats.compilation.fileDependencies.has(path.join(root, 'name.js.flow')));
  });
});

test('uses webpack aliases when resolving types', async () => {
  await bundle({
    'model.js.flow': "import type {Name} from 'domain/name'; export type Model = Name;",
    'types/name.js.flow': 'export type Name = string;'
  }, './model.js.flow', result => {
    assert.ok(result.Model.accepts('Alice'));
    assert.equal(result.Model.accepts(123), false);
  }, root => ({resolve: {alias: {domain: path.join(root, 'types')}}}));
});

test('reports malformed Flow instead of emitting an unvalidated module', async () => {
  await assert.rejects(bundle({'broken.js.flow': 'export type Broken = {'}, './broken.js.flow', () => {}), /Unexpected token/);
});

test('recursively transforms type re-exports', async () => {
  await bundle({
    'model.js.flow': "export type {Person as Model} from './person';",
    'person.js.flow': 'export type Person = {name: string};'
  }, './model.js.flow', result => {
    assert.ok(result.Model.accepts({name: 'Alice'}));
    assert.equal(result.Model.accepts({name: false}), false);
  });
});

test('handles mutually recursive declaration modules', async () => {
  await bundle({
    'a.js.flow': "import type {B} from './b'; export type A = {name: string, next: ?B};",
    'b.js.flow': "import type {A} from './a'; export type B = {count: number, next: ?A};"
  }, './a.js.flow', result => {
    assert.ok(result.A.accepts({name: 'Alice', next: {count: 1, next: null}}));
    assert.equal(result.A.accepts({name: 'Alice', next: {count: 'bad', next: null}}), false);
  });
});

test('emits a source map and reports mixed type/value imports clearly', async () => {
  await bundle({'model.js.flow': 'export type Model = string;'}, './model.js.flow', async (result, stats, root) => {
    const map = JSON.parse(await fs.readFile(path.join(root, 'out', 'bundle.js.map'), 'utf8'));
    assert.ok(map.sources.some(source => source.includes('model.js.flow')));
    assert.ok(map.sourcesContent.some(source => source && source.includes('export type Model')), 'Original Flow source must survive bundling');
  });
  await assert.rejects(bundle({
    'model.js.flow': "import {type Person, createPerson} from './person'; export type Model = Person;"
  }, './model.js.flow', () => {}), /Separate value and type imports/);
});

test('reports a missing type dependency', async () => {
  await assert.rejects(bundle({'model.js.flow': "import type {Missing} from './missing'; export type Model = Missing;"}, './model.js.flow', () => {}), /missing/);
});

test('does not run application Babel configuration', async () => {
  await bundle({
    '.babelrc': '{"plugins":["missing-plugin-must-not-run"]}',
    'model.js.flow': 'export type Model = number;'
  }, './model.js.flow', result => assert.ok(result.Model.accepts(42)));
});

test('validates the original real DraftJS RawDraftContentState example', async () => {
  const draft = require.resolve('draft-js/lib/RawDraftContentState.js.flow');
  await bundle({}, draft, result => {
    assert.ok(result.RawDraftContentState.accepts({blocks: [], entityMap: {}}));
    assert.equal(result.RawDraftContentState.accepts({blocks: ['not a block'], entityMap: {}}), false);
    assert.throws(() => result.RawDraftContentState.assert({blocks: [], entityMap: 12}));
  });
});

test('works through a module rule without an inline loader request', async () => {
  await bundle({'model.js.flow': 'export type Model = number;'}, './model.js.flow', result => {
    assert.ok(result.Model.accepts(42));
    assert.equal(result.Model.accepts('bad'), false);
  }, {useRule: true, module: {rules: [{test: /\.flow$/, use: [loader]}]}});
});
