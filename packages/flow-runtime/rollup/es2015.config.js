/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

import common from './common.config';

const config = Object.assign({}, common);

config.entry = 'src/index.js';

config.plugins = [
  ...common.plugins,
  babel(),
  nodeResolve({
    // not all files you want to resolve are .js files
    extensions: [ '.js', '.json' ]
  })
];

config.targets = [
  { dest: 'dist/flow-runtime.es2015.js', format: 'es' },
];

export default config;