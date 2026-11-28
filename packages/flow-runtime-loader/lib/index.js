"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flowRuntimeLoader;
exports.normalizeLibdefSource = void 0;

var _core = require("@babel/core");

var _loaderUtils = require("loader-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * `.js.flow` files are flow library definitions. They commonly use
 * `declare export` and `declare type` syntax which the babel flow parser
 * does not accept in a module context, so rewrite those forms to the plain
 * module equivalents before transformation.
 */
const normalizeLibdefSource = source => {
  return source.replace(/^([ \t]*)declare[ \t]+export[ \t]+/gm, '$1export ').replace(/^([ \t]*)declare[ \t]+(type|opaque[ \t]+type)[ \t]+/gm, '$1$2 ');
};

exports.normalizeLibdefSource = normalizeLibdefSource;

function flowRuntimeLoader(source) {
  const loaderOptions = (0, _loaderUtils.getOptions)(this) || {};
  const pluginOptions = loaderOptions.flowRuntime || {};
  const normalized = normalizeLibdefSource(source);
  const result = (0, _core.transformSync)(normalized, {
    filename: this.resourcePath,
    babelrc: false,
    configFile: false,
    sourceType: 'module',
    presets: [require.resolve('@babel/preset-flow')],
    plugins: [[require.resolve('babel-plugin-flow-runtime'), _objectSpread({
      assert: false,
      annotate: false
    }, pluginOptions)]]
  });

  if (!result || typeof result.code !== 'string') {
    throw new Error('flow-runtime-loader: babel did not produce any output for ' + this.resourcePath);
  }

  return result.code;
}