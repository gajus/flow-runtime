/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-js';

export default {
  entry: 'src/index.cjs.js',
  moduleName: 'flow-runtime',
  plugins: [
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
  ],
  targets: [
    { dest: 'dist/flow-runtime.min.js', format: 'umd' },
  ]
};