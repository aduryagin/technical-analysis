"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VWMA = VWMA;

var _sma = require("./sma");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function VWMA(_ref) {
  var candles = _ref.candles,
      period = _ref.period;
  var _result = [];
  var sma1 = (0, _sma.SMA)([], period);
  var sma2 = (0, _sma.SMA)([], period);

  function calculate(candle) {
    var sma1Result = sma1.update(_objectSpread(_objectSpread({}, candle), {}, {
      close: candle.close * candle.volume
    }));
    var sma2Result = sma2.update(_objectSpread(_objectSpread({}, candle), {}, {
      close: candle.volume
    }));
    if (!sma1Result || !sma2Result) return;
    return {
      time: candle.time,
      value: sma1Result.value / sma2Result.value
    };
  }

  candles.forEach(function (item) {
    var res = calculate(item);
    if (res) _result.push(res);
  });
  return {
    result: function result() {
      return _result;
    },
    update: function update(candle) {
      if (_result.length && _result[_result.length - 1].time === candle.time) {
        _result = _result.slice(0, -1);
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}