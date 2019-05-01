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
    static init({foo}: {foo: string}) {

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

} @_flowRuntime.default.annotate(_flowRuntime.default.class("Model", _flowRuntime.default.staticMethod("init", _flowRuntime.default.param("_arg", _flowRuntime.default.object(_flowRuntime.default.property("foo", _flowRuntime.default.string())))))) class Model {
static init(_arg) {
let {
foo
} = _arg;

}
}
`;
