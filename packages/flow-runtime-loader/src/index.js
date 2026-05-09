/* @flow */

import {transformSync} from '@babel/core';
import flowRuntimePlugin from 'babel-plugin-flow-runtime';

type LoaderContext = {
  async?: () => (error: ?Error, result?: string, sourceMap?: Object) => void;
  cacheable?: () => void;
  getOptions?: () => Object;
  query?: string | Object;
  resourcePath?: string;
  sourceMap?: boolean;
};

type LoaderOptions = {
  babel?: Object;
};

export default function flowRuntimeLoader (source: string | Buffer, inputSourceMap?: Object) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async && this.async();
  const input = Buffer.isBuffer(source) ? source.toString() : source;

  try {
    const options = getOptions(this);
    const babelOptions = options.babel || {};
    const flowRuntimeOptions = getFlowRuntimeOptions(options);
    const result = transformSync(input, {
      ...babelOptions,
      babelrc: babelOptions.babelrc === undefined ? false : babelOptions.babelrc,
      configFile: babelOptions.configFile === undefined ? false : babelOptions.configFile,
      filename: babelOptions.filename || this.resourcePath,
      inputSourceMap,
      plugins: getPlugins(babelOptions.plugins, flowRuntimeOptions),
      presets: getPresets(babelOptions.presets),
      sourceMaps: babelOptions.sourceMaps === undefined ? this.sourceMap || Boolean(inputSourceMap) : babelOptions.sourceMaps
    });

    const code = result && result.code ? result.code : input;
    const map = result && result.map ? result.map : inputSourceMap;

    if (callback) {
      callback(null, code, map);
      return;
    }
    return code;
  }
  catch (error) {
    if (callback) {
      callback(error);
      return;
    }
    throw error;
  }
}

function getOptions (context: LoaderContext): LoaderOptions {
  if (typeof context.getOptions === 'function') {
    return context.getOptions() || {};
  }
  const {query} = context;
  if (!query) {
    return {};
  }
  if (typeof query === 'object') {
    return query;
  }
  return parseQuery(query);
}

function getFlowRuntimeOptions (options: LoaderOptions): Object {
  const pluginOptions = {...options};
  delete pluginOptions.babel;
  return pluginOptions;
}

function getPlugins (plugins?: Array<any>, flowRuntimeOptions: Object): Array<any> {
  const result = plugins ? plugins.slice() : [];
  result.push([flowRuntimePlugin, flowRuntimeOptions]);
  return result;
}

function getPresets (presets?: Array<any>): Array<any> {
  const result = presets ? presets.slice() : [];
  result.push(require.resolve('@babel/preset-flow'));
  return result;
}

function parseQuery (query: string): Object {
  const raw = query.charAt(0) === '?' ? query.slice(1) : query;
  if (!raw) {
    return {};
  }
  if (raw.charAt(0) === '{') {
    return JSON.parse(raw);
  }
  return raw.split('&').reduce((options, segment) => {
    if (!segment) {
      return options;
    }
    const pair = segment.split('=');
    const key = decodeURIComponent(pair[0]);
    const value = pair.length > 1 ? decodeURIComponent(pair.slice(1).join('=')) : undefined;
    options[key] = coerceQueryValue(value);
    return options;
  }, {});
}

function coerceQueryValue (value?: string): any {
  if (value === undefined || value === '') {
    return true;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (value === 'null') {
    return null;
  }
  return value;
}
