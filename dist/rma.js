"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RMA = RMA;

var _sma = require("./sma");

/* eslint-disable no-restricted-globals */
function RMA(candles, period) {
  var _result = [];
  var prevPrevSum;
  var prevSum;
  var sum = 0;
  var sma = (0, _sma.SMA)([], period);
  var exponent = 1 / period;

  function calculate(candle) {
    if (isNaN(prevSum) || prevSum === undefined) {
      var _sma$update;

      sum = (_sma$update = sma.update(candle)) === null || _sma$update === void 0 ? void 0 : _sma$update.value;
    } else {
      sum = exponent * candle.close + (1 - exponent) * (prevSum || 0);
    }

    prevPrevSum = prevSum;
    prevSum = sum;
    return sum ? {
      time: candle.time,
      value: sum
    } : sum;
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
        prevSum = prevPrevSum;
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}