"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bollingerBands = bollingerBands;

var _sma = require("./sma");

var _stdev = require("./stdev");

function bollingerBands(_ref) {
  var candles = _ref.candles,
      period = _ref.period,
      stdDev = _ref.stdDev;
  var result = [];
  var sma = (0, _sma.SMA)([], period);
  var stdev = (0, _stdev.STDEV)({
    candles: [],
    period: period
  });

  function calculate(candle) {
    var basis = sma.update(candle);
    var sd = stdev.update(candle);
    if (!basis) return undefined;
    var dev = stdDev * sd.value;
    var upper = basis.value + dev;
    var lower = basis.value - dev;
    var bbr = (candle.close - lower) / (upper - lower);
    return {
      time: candle.time,
      value: bbr,
      candle: candle
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