'use strict';

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

var _mobx = require('mobx');

var mobx = _interopRequireWildcard(_mobx);

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _assert = require('assert');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObservableMap = mobx.ObservableMap;


describe('registerMobxTypes', function () {

  var ThingType = _flowRuntime2.default.object({
    numbers: _flowRuntime2.default.array(_flowRuntime2.default.number()),
    map: _flowRuntime2.default.ref(Map, _flowRuntime2.default.string(), _flowRuntime2.default.string())
  });

  var thing = mobx.observable({
    numbers: [1, 2, 3],
    map: new ObservableMap({ foo: 'bar' })
  });

  var other = mobx.observable({
    numbers: [false, true],
    map: new ObservableMap({ foo: 123 })
  });

  it('should not accept observable arrays and maps before registration', function () {
    (0, _assert.throws)(function () {
      ThingType.assert(thing);
    });
  });

  it('should register the mobx types', function () {
    (0, _2.default)(_flowRuntime2.default, mobx);
  });

  it('should now accept observable arrays and maps', function () {
    ThingType.assert(thing);
  });

  it('should fail on invalid values', function () {
    (0, _assert.throws)(function () {
      ThingType.assert(other);
    });
  });
});