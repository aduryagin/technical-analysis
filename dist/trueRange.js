"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trueRange = trueRange;

/* eslint-disable no-restricted-globals */
function trueRange(candles) {
  var _result = [];
  var previousClose;
  var prevPrevClose;
  var trueRangeResult;

  function calculate(candle) {
    if (previousClose === undefined) {
      previousClose = candle.close;
      return {
        time: candle.time,
        value: candle.high - candle.low
      };
    }

    trueRangeResult = Math.max(candle.high - candle.low, isNaN(Math.abs(candle.high - previousClose)) ? 0 : Math.abs(candle.high - previousClose), isNaN(Math.abs(candle.low - previousClose)) ? 0 : Math.abs(candle.low - previousClose));
    prevPrevClose = previousClose;
    previousClose = candle.close;
    return {
      time: candle.time,
      value: trueRangeResult
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
        previousClose = prevPrevClose;
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}