'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const babel = require('@babel/core');
const project = path.resolve(process.env.FLOW_113_SOURCE || path.join(__dirname, '../..'));
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-warn-113-'));
function build(source, target, tests) {
  fs.mkdirSync(target, {recursive: true});
  for (const entry of fs.readdirSync(source, {withFileTypes: true})) {
    if (!tests && (entry.name === '__tests__' || entry.name === '__fixtures__' || entry.name.endsWith('.test.js'))) continue;
    const input = path.join(source, entry.name), output = path.join(target, entry.name);
    if (entry.isDirectory()) build(input, output, tests);
    else if (entry.isFile() && entry.name.endsWith('.js')) {
      const result = babel.transformFileSync(input, {babelrc: false, configFile: false,
        presets: [require.resolve('@babel/preset-flow')],
        plugins: [
          ...(tests ? [[require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
            [require.resolve('@babel/plugin-transform-class-properties'), {loose: true}]] : []),
          require.resolve('@babel/plugin-transform-modules-commonjs')
        ]});
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
const existing = process.argv.includes('--existing');
if (existing) build(path.join(project, 'packages/flow-runtime/src/errorReporting/__tests__'),
  path.join(root, 'node_modules/flow-runtime/errorReporting/__tests__'), true);
const result = spawnSync(process.execPath, ['--test', path.join(__dirname, 'regression.test.js')], {
  env: {...process.env, FLOW_113_ROOT: root, FLOW_113_EXISTING: existing ? '1' : '',
    NODE_PATH: [path.join(root, 'node_modules'), path.join(__dirname, 'node_modules')].join(path.delimiter)},
  encoding: 'utf8', windowsHide: true, timeout: 120000});
process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
console.log('Built source artifact retained: ' + root);
if (result.error) throw result.error;
process.exitCode = result.status === 0 ? 0 : 1;
