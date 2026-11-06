'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const babel = require('@babel/core');

async function build (source, target) {
  await fs.mkdir(target, {recursive: true});
  for (const file of await fs.readdir(source, {withFileTypes: true})) {
    if (file.name === '__tests__' || file.name === '__fixtures__') continue;
    const input = path.join(source, file.name);
    const output = path.join(target, file.name);
    if (file.isDirectory()) await build(input, output);
    else if (file.isFile() && file.name.endsWith('.js') && !file.name.endsWith('.test.js')) {
      const result = babel.transformFileSync(input, {
        babelrc: false, configFile: false,
        presets: [require.resolve('@babel/preset-flow')],
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
      });
      await fs.writeFile(output, result.code);
    }
  }
}

(async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'flow-map-177-'));
  const project = path.resolve(process.env.FLOW_MAP_SOURCE_PROJECT || path.resolve(__dirname, '../..'));
  try {
    for (const name of ['flow-config-parser', 'babel-plugin-flow-runtime', 'flow-runtime']) {
      const target = path.join(root, 'node_modules', name);
      await build(path.join(project, 'packages', name, 'src'), target);
      await fs.writeFile(path.join(target, 'package.json'), JSON.stringify({
        name, main: name === 'flow-config-parser' ? 'flowConfigParser.js' : 'index.js'
      }));
    }
    const compilerTests = path.join(project, 'packages/babel-plugin-flow-runtime/src/__tests__');
    for (const filename of ['testTransform.js', '__fixtures__/typeAliases/builtins/map.js', '__fixtures__/typeAssertions/functions/multipleTypeParameters.js']) {
      const output = path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__', filename);
      await fs.mkdir(path.dirname(output), {recursive: true});
      const result = babel.transformFileSync(path.join(compilerTests, filename), {
        babelrc: false, configFile: false,
        presets: [require.resolve('@babel/preset-flow')],
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
      });
      await fs.writeFile(output, result.code);
    }
    const args = ['--test'];
    const pattern = process.argv.includes('--focused')
      ? 'official core-js|actual transformed class|invalid Map keys|native registered Map|constructor-bound Map|custom global predicate|native Map factory|ordinary native Map|existing compiler fixture|locally shadowed Map'
      : process.env.FLOW_MAP_TEST_PATTERN;
    if (pattern) args.push('--test-name-pattern', pattern);
    args.push(path.join(__dirname, 'regression.test.js'));
    const result = spawnSync(process.execPath, args, {
      env: {...process.env, FLOW_MAP_TEST_ROOT: root,
        NODE_PATH: [path.join(root, 'node_modules'), path.join(__dirname, 'node_modules')].join(path.delimiter)},
      windowsHide: true, encoding: 'utf8', timeout: 120000
    });
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    if (result.error) throw result.error;
    process.exitCode = result.status === 0 ? 0 : 1;
  }
  finally {
    assert.equal(path.dirname(root), os.tmpdir());
    assert.ok(path.basename(root).startsWith('flow-map-177-'));
    await fs.rm(root, {recursive: true, force: true});
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
