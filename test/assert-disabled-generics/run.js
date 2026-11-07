'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const babel = require('@babel/core');
const project = path.resolve(process.env.FLOW_180_SOURCE || path.join(__dirname, '../..'));
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-generics-180-'));

function build(source, target, tests) {
  fs.mkdirSync(target, {recursive: true});
  for (const entry of fs.readdirSync(source, {withFileTypes: true})) {
    if (!tests && (entry.name === '__tests__' || entry.name === '__fixtures__')) continue;
    const input = path.join(source, entry.name);
    const output = path.join(target, entry.name);
    if (entry.isDirectory()) build(input, output, tests);
    else if (entry.isFile() && entry.name.endsWith('.js') && (tests || !entry.name.endsWith('.test.js'))) {
      const result = babel.transformFileSync(input, {
        babelrc: false, configFile: false,
        presets: [require.resolve('@babel/preset-flow')],
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
      });
      fs.writeFileSync(output, result.code);
    }
  }
}

for (const name of ['flow-config-parser', 'babel-plugin-flow-runtime', 'flow-runtime']) {
  const target = path.join(root, 'node_modules', name);
  build(path.join(project, 'packages', name, 'src'), target, false);
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({name,
    main: name === 'flow-config-parser' ? 'flowConfigParser.js' : 'index.js'}));
}
const allFixtures = process.argv.includes('--all-fixtures');
if (process.argv.includes('--fixtures') || allFixtures) {
  build(path.join(project, 'packages/babel-plugin-flow-runtime/src/__tests__'),
    path.join(root, 'node_modules/babel-plugin-flow-runtime/__tests__'), true);
}
const result = spawnSync(process.execPath, ['--test', path.join(__dirname, 'regression.test.js')], {
  env: {...process.env, FLOW_180_ROOT: root,
    FLOW_180_FIXTURES: allFixtures ? 'all' : process.argv.includes('--fixtures') ? '1' : '',
    NODE_PATH: [path.join(root, 'node_modules'), path.join(__dirname, 'node_modules')].join(path.delimiter)},
  encoding: 'utf8', windowsHide: true, timeout: 120000
});
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
console.log('Built source artifact retained: ' + root);
if (result.error) throw result.error;
process.exitCode = result.status === 0 ? 0 : 1;
