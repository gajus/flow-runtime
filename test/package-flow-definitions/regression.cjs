'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createRequire} = require('node:module');
const {test} = require('node:test');
const babel = require('@babel/core');

test('paired package shadow definition drives consumer runtime validation', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-runtime-shadow-'));
  const dependencies = path.join(root, 'node_modules');
  fs.mkdirSync(dependencies);
  const repo = path.resolve(__dirname, '../..');
  const preset = require.resolve('@babel/preset-flow');
  const commonjs = require.resolve('@babel/plugin-transform-modules-commonjs');
  function compile(source, filename, plugins = [commonjs]) {
    return babel.transformSync(source, {
      filename, babelrc: false, configFile: false, presets: [preset], plugins,
    }).code;
  }
  function build(input, output) {
    fs.mkdirSync(output, {recursive: true});
    for (const entry of fs.readdirSync(input, {withFileTypes: true})) {
      const source = path.join(input, entry.name);
      const target = path.join(output, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('__')) build(source, target);
      else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
        fs.writeFileSync(target, compile(fs.readFileSync(source, 'utf8'), source));
      }
    }
  }
  for (const name of ['flow-config-parser', 'flow-runtime', 'babel-plugin-flow-runtime', 'flow-runtime-cli']) {
    const output = path.join(dependencies, name);
    build(path.join(repo, 'packages', name, 'src'), output);
    if (name === 'flow-config-parser') {
      fs.writeFileSync(path.join(output, 'package.json'), '{"main":"flowConfigParser.js"}');
    }
  }
  for (const name of ['@babel', 'babylon', 'babel-generator', 'double-ended-queue', 'flow-parser', 'prettier']) {
    fs.symlinkSync(path.join(__dirname, 'node_modules', name), path.join(dependencies, name), 'junction');
  }
  const example = path.join(dependencies, 'paired-example');
  fs.mkdirSync(example);
  fs.writeFileSync(path.join(example, 'index.js'),
    'exports.runtimeValue = 7; exports.Value = require("flow-runtime").default.number();');
  fs.writeFileSync(path.join(example, 'index.js.flow'), 'export type Value = string;');
  const consumer = path.join(root, 'consumer.js');
  const source = '// @flow\nimport type {Value as Alias} from "paired-example";\n' +
    'import {runtimeValue} from "paired-example";\n' +
    'export function check(value: Alias): Alias { return value; }\n' +
    'export const value = runtimeValue;';
  fs.writeFileSync(consumer, source);
  const load = createRequire(consumer);
  const previous = process.cwd();
  let generated;
  try {
    process.chdir(root);
    fs.mkdirSync(path.join(dependencies, 'flow-builtins'));
    fs.mkdirSync(path.join(root, 'flow-typed'));
    generated = await load('flow-runtime-cli/generateDefinitions').default([consumer]);
  } finally {
    process.chdir(previous);
  }
  const definitions = path.join(root, 'definitions.js');
  fs.writeFileSync(definitions, compile(generated, definitions));
  const plugin = load('babel-plugin-flow-runtime').default;
  const plugins = [[plugin, {assert: true, annotate: false}], commonjs];
  const fallback = path.join(root, 'fallback.js');
  fs.writeFileSync(fallback, compile(source, fallback, plugins));
  assert.equal(load(fallback).check(12), 12);
  assert.throws(() => load(fallback).check('wrong'), /must be a number/);
  load(definitions);
  fs.writeFileSync(consumer, compile(source, consumer, plugins));
  const result = load(consumer);
  assert.equal(result.value, 7);
  assert.equal(result.check('ok'), 'ok');
  assert.throws(() => result.check(12), /must be a string/);
});
