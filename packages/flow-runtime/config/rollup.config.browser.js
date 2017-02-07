/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.cjs.js',
  moduleName: 'flow-runtime',
  sourceMap: true,
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
    })
  ],
  targets: [
    { dest: 'dist/flow-runtime.umd.js', format: 'umd' },
  ]
};