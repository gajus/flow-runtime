/* @flow */

import {transformSync} from '@babel/core';
import {getOptions} from 'loader-utils';

/**
 * `.js.flow` files are flow library definitions. They commonly use
 * `declare export` and `declare type` syntax which the babel flow parser
 * does not accept in a module context, so rewrite those forms to the plain
 * module equivalents before transformation.
 */
export const normalizeLibdefSource = (source: string): string => {
  return source
    .replace(/^([ \t]*)declare[ \t]+export[ \t]+/gm, '$1export ')
    .replace(/^([ \t]*)declare[ \t]+(type|opaque[ \t]+type)[ \t]+/gm, '$1$2 ');
};

export default function flowRuntimeLoader (source: string): string {
  const loaderOptions = getOptions(this) || {};
  const pluginOptions = loaderOptions.flowRuntime || {};

  const normalized = normalizeLibdefSource(source);

  const result = transformSync(normalized, {
    filename: this.resourcePath,
    babelrc: false,
    configFile: false,
    sourceType: 'module',
    presets: [
      require.resolve('@babel/preset-flow')
    ],
    plugins: [
      [
        require.resolve('babel-plugin-flow-runtime'),
        {
          assert: false,
          annotate: false,
          ...pluginOptions
        }
      ]
    ]
  });

  if (!result || typeof result.code !== 'string') {
    throw new Error('flow-runtime-loader: babel did not produce any output for ' + this.resourcePath);
  }

  return result.code;
}
