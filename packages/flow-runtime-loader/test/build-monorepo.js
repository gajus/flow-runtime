'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const babel = require('@babel/core');

async function compileTree (source, target) {
  await fs.mkdir(target, {recursive: true});
  for (const entry of await fs.readdir(source, {withFileTypes: true})) {
    if (entry.name === '__tests__' || entry.name === '__fixtures__') continue;
    const input = path.join(source, entry.name);
    const output = path.join(target, entry.name);
    if (entry.isDirectory()) await compileTree(input, output);
    else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
      const result = babel.transformFileSync(input, {
        babelrc: false,
        configFile: false,
        presets: [require.resolve('@babel/preset-flow')],
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
      });
      await fs.writeFile(output, result.code);
    }
  }
}

(async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'flow-runtime-source-'));
  const packages = path.resolve(__dirname, '../..');
  try {
    for (const name of ['flow-config-parser', 'babel-plugin-flow-runtime', 'flow-runtime']) {
      const source = path.join(packages, name);
      const metadata = JSON.parse(await fs.readFile(path.join(source, 'package.json'), 'utf8'));
      const target = path.join(root, 'node_modules', name);
      await compileTree(path.join(source, 'src'), target);
      await fs.writeFile(path.join(target, 'package.json'), JSON.stringify({
        name, version: metadata.version,
        main: name === 'flow-config-parser' ? 'flowConfigParser.js' : 'index.js'
      }));
      console.log('Built repository source: ' + name + '@' + metadata.version);
    }
    for (const version of ['5', '4']) {
      console.log('Testing repository source with Webpack ' + version);
      const result = spawnSync(process.execPath, [
        '--require', path.join(__dirname, 'use-monorepo.js'),
        '--test', path.join(__dirname, 'loader.test.js')
      ], {
        cwd: path.resolve(__dirname, '..'),
        env: {...process.env, FLOW_RUNTIME_SOURCE_ROOT: root,
          NODE_PATH: path.resolve(__dirname, '../node_modules'),
          WEBPACK_VERSION: version, NODE_OPTIONS: '--openssl-legacy-provider'},
        encoding: 'utf8', timeout: 120000, windowsHide: true
      });
      process.stdout.write(result.stdout || '');
      process.stderr.write(result.stderr || '');
      if (result.error) throw result.error;
      assert.equal(result.status, 0, 'Repository-source integration tests failed');
    }
  }
  finally {
    assert.equal(path.dirname(root), os.tmpdir());
    assert.ok(path.basename(root).startsWith('flow-runtime-source-'));
    await fs.rm(root, {recursive: true, force: true});
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
