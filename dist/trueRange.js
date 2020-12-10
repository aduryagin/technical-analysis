"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trueRange = trueRange;

/* eslint-disable no-restricted-globals */
function trueRange(candles) {
  var result = [];
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
    if (res) result.push(res);
  });
  return {
    result: result,
    update: function update(candle) {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        previousClose = prevPrevClose;
      }

      var item = calculate(candle);
      if (item) result.push(item);
      return item;
    }
  };
}