/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  moduleName: 'flow-runtime',
  sourceMap: true,
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 4
          },
          exclude: [
            "transform-regenerator"
          ],
          modules: false
        }],
        "@babel/preset-react",
        "@babel/preset-flow"
      ],
      plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
        '@babel/plugin-external-helpers'
      ]
    }),
    nodeResolve({
      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ]
    })
  ],
  targets: [
    { dest: 'dist/flow-runtime.es2015.js', format: 'es' },
  ]
};
