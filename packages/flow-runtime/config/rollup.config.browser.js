/* @flow */

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.cjs.js',
  output: {
    name: 'flow-runtime',
    sourceMap: true,
    file: 'dist/flow-runtime.umd.js',
    format: 'umd',
  },
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ["@babel/preset-env", {
          "targets": {
            "browsers": ["last 2 versions"]
          },
          "exclude": [
            "transform-regenerator"
          ],
        }],
        "@babel/preset-react",
        "@babel/preset-flow"
      ],
      plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
        ['@babel/plugin-transform-runtime', {
          helpers: false,
          regenerator: true,
        }]
      ]
    }),
    nodeResolve({
      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ]
    })
  ],
};
