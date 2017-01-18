/* @flow */

export default {
  entry: 'src/globalContext.js',
  moduleName: 'flow-runtime',
  plugins: [],
  targets: [
    { dest: 'dist/flow-runtime.cjs.js', format: 'cjs' },
    { dest: 'dist/flow-runtime.umd.js', format: 'umd' },
  ]
};