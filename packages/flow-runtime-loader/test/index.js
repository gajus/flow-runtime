'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const webpack = require('webpack');
const loader = require('../');
const loaderPath = require.resolve('../');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-runtime-loader-'));
const runtime = process.env.FLOW_RUNTIME_TEST_MODULE || require.resolve('flow-runtime');

function write(name, source) { fs.writeFileSync(path.join(temp, name), source); }
function compile(entry, output, options) {
  return new Promise((resolve, reject) => {
    const compiler = webpack({
      mode: 'development', target: 'node', context: temp,
      entry: './' + entry,
      output: { path: temp, filename: output, libraryTarget: 'commonjs2' },
      resolve: { alias: { 'flow-runtime': runtime, Model: path.join(temp, 'model.js') } },
      devtool: 'source-map',
      module: { rules: options ? [{test: /\.js\.flow$/, use: [{loader: loaderPath, options}]}] : [] }
    });
    compiler.run((error, stats) => {
      const finish = () => error ? reject(error) : stats.hasErrors()
        ? reject(new Error(stats.toString({all: false, errors: true}))) : resolve(stats);
      if (compiler.close) compiler.close(finish); else finish();
    });
  });
}
function transform(source, sourceMap, overrides) {
  return new Promise((resolve, reject) => {
    let cached = false;
    loader.call(Object.assign({
      resourcePath: path.join(temp, 'direct.js.flow'), sourceMap: true,
      getOptions: () => ({}), cacheable: () => { cached = true; },
      async: () => (error, code, map) => error ? reject(error) : resolve({code, map, cached}),
      resolve: () => { throw new Error('No imports expected'); },
      addDependency: () => {}
    }, overrides), source, sourceMap);
  });
}

async function main() {
  write('model.js', 'exports.marker = "real-value";');
  write('model.js.flow', 'export type Model = { id: number };');
  // No item.js: extensionless declaration-only dependencies must resolve too.
  write('item.js.flow', 'import type {Model} from "Model"; export type Item = { model: Model, label: string };');
  write('record.js.flow', 'import {type Model, marker} from "Model"; import type {Item} from "./item"; export type Record = {model: Model, items: Array<Item>}; export const actualMarker = marker;');
  write('reexport.js.flow', 'export type {Item} from "./item";');
  write('entry.js', 'export {Record, actualMarker} from ' + JSON.stringify('!!' + loaderPath + '!' + path.join(temp, 'record.js.flow')) + '; export {Item} from ' + JSON.stringify('!!' + loaderPath + '!' + path.join(temp, 'reexport.js.flow')) + ';');
  const stats = await compile('entry.js', 'bundle.js');
  const result = require(path.join(temp, 'bundle.js'));
  assert.strictEqual(result.actualMarker, 'real-value');
  assert.throws(() => result.Item.assert({model:{id:'wrong'},label:'ok'}), /number/);
  const good = {model:{id:1},items:[{model:{id:2},label:'ok'}]};
  assert.strictEqual(result.Record.assert(good), good);
  assert.throws(() => result.Record.assert({model:{id:'wrong'},items:[]}), /number/);
  assert.throws(() => result.Record.assert({model:{id:1},items:[{model:{id:'wrong'},label:'ok'}]}), /number/);
  assert(stats.compilation.fileDependencies.has(path.join(temp, 'model.js.flow')));
  assert(fs.existsSync(path.join(temp, 'bundle.js.map')));
  const bundledMap = JSON.parse(fs.readFileSync(path.join(temp, 'bundle.js.map'), 'utf8'));
  assert(bundledMap.mappings.length > 0);
  assert(bundledMap.sourcesContent.some(source => source && source.includes('export type Record')));

  // Delimiters in options must not introduce another loader or fragment.
  write('options-entry.js', 'export {Record} from "./record.js.flow";');
  await compile('options-entry.js', 'options-bundle.js', {testMarker: '!missing-loader#fragment'});
  const withOptions = require(path.join(temp, 'options-bundle.js')).Record;
  assert.strictEqual(withOptions.assert(good), good);

  const draftModule = process.env.FLOW_RUNTIME_DRAFT_MODULE || require.resolve('draft-js/lib/RawDraftContentState.js.flow');
  write('draft-entry.js', 'export {RawDraftContentState} from ' + JSON.stringify('!!' + loaderPath + '!' + draftModule) + ';');
  await compile('draft-entry.js', 'draft-bundle.js');
  const draft = require(path.join(temp, 'draft-bundle.js')).RawDraftContentState;
  const document = {blocks: [{key:'key',text:'hello',type:'unstyled',depth:0,inlineStyleRanges:[],entityRanges:[],data:{}}], entityMap:{}};
  assert.strictEqual(draft.assert(document), document);
  assert.throws(() => draft.assert({blocks:'wrong',entityMap:{}}));
  assert.throws(() => draft.assert({blocks:document.blocks,entityMap:{'0':{type:'LINK',mutability:42,data:{}}}}));

  const direct = await transform('export type Count = number;', {
    version:3, sources:['original.flow'], sourcesContent:['export type Count = number;'], names:[], mappings:'AAAA'
  });
  assert(direct.cached);
  assert(direct.map.sources.some(name => name.endsWith('original.flow')));
  assert(/export/.test(direct.code));
  await assert.rejects(transform('export type Broken = ;'));
  const noMap = await transform('export type Count = number;', undefined, {sourceMap: false});
  assert.strictEqual(noMap.map, null);
  const typeImport = 'import type {Model} from "./model"; export type Value = Model;';
  await assert.rejects(transform(typeImport, undefined, {
    resolve: (directory, request, callback) => callback(null, false)
  }), /could not resolve type import/);
  await assert.rejects(transform(typeImport, undefined, {
    resolve: (directory, request, callback) => callback(null, '/tmp/unexpected!loader.js.flow')
  }), /cannot safely encode/);

  write('missing.js.flow', 'import type {Missing} from "./not-present"; export type Value = Missing;');
  write('missing-entry.js', 'export {Value} from ' + JSON.stringify('!!' + loaderPath + '!' + path.join(temp, 'missing.js.flow')) + ';');
  await assert.rejects(compile('missing-entry.js', 'missing-bundle.js'), /not-present/);
  console.log('PASS: real Draft.js RawDraftContentState, transitive Flow types, aliases, sibling stubs, mixed imports, runtime rejection, dependency tracking, source-map composition, delimiter-safe options, disabled aliases, unsafe paths, syntax and resolution errors.');
}
main().then(() => fs.rmSync(temp, {recursive:true, force:true}), error => {
  console.error(error);
  fs.rmSync(temp, {recursive:true, force:true});
  process.exitCode = 1;
});
