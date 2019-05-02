export const integration = {
  presets: [
    ["@babel/preset-env", {"targets": {"node": "current"}}],
    '@babel/preset-flow',
  ],
  plugins: [
    'babel-plugin-flow-runtime',
  ],
};

export const input = `
  class Model {
    static init({a: [b, {d, e}], f: {g: [h, ...k], i}, ...j}: {a: [number, {d: string, e: number}], f: {g: [string], i: number}}) {

    }
  }
`;

export const expected = `
"use strict";
 var _flowRuntime = _interopRequireDefault(require("flow-runtime"));
 function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
default: obj
};

} @_flowRuntime.default.annotate(_flowRuntime.default.class("Model", _flowRuntime.default.staticMethod("init", _flowRuntime.default.param("_arg", _flowRuntime.default.object(_flowRuntime.default.property("a", _flowRuntime.default.tuple(_flowRuntime.default.number(), _flowRuntime.default.object(_flowRuntime.default.property("d", _flowRuntime.default.string()), _flowRuntime.default.property("e", _flowRuntime.default.number())))), _flowRuntime.default.property("f", _flowRuntime.default.object(_flowRuntime.default.property("g", _flowRuntime.default.tuple(_flowRuntime.default.string())), _flowRuntime.default.property("i", _flowRuntime.default.number())))))))) class Model {
static init(_arg) {
let {
a: [b, {
d, e
}], f: {
g: [h, ...k], i
}, ...j
} = _arg;
}
}
`;
