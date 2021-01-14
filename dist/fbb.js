"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FBB = FBB;

var _vwma = require("./vwma");

var _stdev = require("./stdev");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function FBB(_ref) {
  var candles = _ref.candles,
      period = _ref.period,
      multiplier = _ref.multiplier;
  multiplier = multiplier || 3;
  period = period || 200;
  var result = [];
  var basis = (0, _vwma.VWMA)({
    candles: [],
    period: period
  });
  var dev = (0, _stdev.STDEV)({
    candles: [],
    period: period
  });

  function calculate(candle) {
    var hlc3 = (candle.high + candle.close + candle.low) / 3;
    var basisResult = basis.update(_objectSpread(_objectSpread({}, candle), {}, {
      close: hlc3
    }));
    var devResult = dev.update(_objectSpread(_objectSpread({}, candle), {}, {
      close: hlc3
    }));
    if (!basisResult || !devResult) return;
    var mDev = multiplier * devResult.value;
    var upper1 = basisResult.value + 0.236 * mDev;
    var upper2 = basisResult.value + 0.382 * mDev;
    var upper3 = basisResult.value + 0.5 * mDev;
    var upper4 = basisResult.value + 0.618 * mDev;
    var upper5 = basisResult.value + 0.764 * mDev;
    var upper6 = basisResult.value + 1 * mDev;
    var lower1 = basisResult.value - 0.236 * mDev;
    var lower2 = basisResult.value - 0.382 * mDev;
    var lower3 = basisResult.value - 0.5 * mDev;
    var lower4 = basisResult.value - 0.618 * mDev;
    var lower5 = basisResult.value - 0.764 * mDev;
    var lower6 = basisResult.value - 1 * mDev;
    return {
      time: candle.time,
      basis: basisResult.value,
      upper1: upper1,
      upper2: upper2,
      upper3: upper3,
      upper4: upper4,
      upper5: upper5,
      upper6: upper6,
      lower1: lower1,
      lower2: lower2,
      lower3: lower3,
      lower4: lower4,
      lower5: lower5,
      lower6: lower6
    };
  }

  candles.forEach(function (item) {
    var res = calculate(item);
    if (res) result.push(res);
  });
  return {
    result: result,
    update: function update(candle) {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
      }

      var item = calculate(candle);
      if (item) result.push(item);
      return item;
    }
  };
}