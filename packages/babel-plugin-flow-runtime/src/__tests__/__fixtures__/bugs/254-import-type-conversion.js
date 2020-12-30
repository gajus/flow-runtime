// @flow

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
// @flow
// @flow-runtime
import { type Foo } from './Foo'
`;

export const expected = `
"use strict";
var _Foo2 = require("./Foo");
var _flowRuntime = _interopRequireDefault(require("flow-runtime"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

// -runtime
const Foo = _flowRuntime.default.tdz(() => _Foo2.Foo);
`;
