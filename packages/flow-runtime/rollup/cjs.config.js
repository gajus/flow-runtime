/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

import common from './common.config';

const config = Object.assign({}, common);

config.entry = 'src/index.cjs.js';

config.plugins = [
  ...common.plugins,
  babel({
    presets: ['react']
  }),
  nodeResolve({
    // not all files you want to resolve are .js files
    extensions: [ '.js', '.json' ]
  })
];

config.targets = [
  { dest: 'dist/flow-runtime.js', format: 'cjs' },
];

export default config;