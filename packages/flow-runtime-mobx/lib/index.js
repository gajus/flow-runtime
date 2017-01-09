'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerMobxTypes;
function registerMobxTypes(context, mobx) {
  var originalArrayPredicate = context.getPredicate('Array');
  var originalMapPredicate = context.getPredicate('Map');

  context.setPredicate('Array', function (input) {
    if (originalArrayPredicate(input)) {
      return true;
    } else {
      return mobx.isObservableArray(input);
    }
  });

  context.setPredicate('Map', function (input) {
    if (originalMapPredicate(input)) {
      return true;
    } else {
      return mobx.isObservableMap(input);
    }
  });
}