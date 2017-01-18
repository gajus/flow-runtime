/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-js';

import common from './common.config';

const config = Object.assign({}, common);

config.entry = 'src/index.cjs.js';

config.plugins = common.plugins.concat([
  babel({
    babelrc: false,
    presets: [
      ['env', {
        targets: {
          browsers: ['last 2 versions']
        },
        modules: false
      }],
      'stage-0',
      'react'
    ],
    plugins: [
      'transform-decorators-legacy',
      'external-helpers'
    ]
  }),
  nodeResolve({
    // not all files you want to resolve are .js files
    extensions: [ '.js', '.json' ]
  }),
  uglify({}, minify)
]);

config.targets = [
  { dest: 'dist/flow-runtime.min.js', format: 'umd' },
];

export default config;