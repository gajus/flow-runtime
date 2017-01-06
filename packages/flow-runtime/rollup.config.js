/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-js';

export default {
  entry: 'src/globalContext.js',
  moduleName: 'flow-runtime',
  plugins: [
    babel({
      presets: ['react']
    }),
    nodeResolve({
      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ]
    }),
    uglify({}, minify)
  ],
  targets: [
    { dest: 'dist/flow-runtime.cjs.js', format: 'cjs' },
    { dest: 'dist/flow-runtime.umd.js', format: 'umd' },
  ]
};