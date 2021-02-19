"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VWAP = VWAP;

function VWAP(candles) {
  var _result = [];
  var cumulativeTotal = 0;
  var cumulativeVolume = 0;
  var lastCumulativeTotal = 0;
  var lastCumulativeVolume = 0;

  function calculate(candle) {
    lastCumulativeTotal = cumulativeTotal;
    lastCumulativeVolume = cumulativeVolume;
    var typicalPrice = (candle.high + candle.low + candle.close) / 3;
    var total = candle.volume * typicalPrice;
    cumulativeTotal += total;
    cumulativeVolume += candle.volume;
    return {
      time: candle.time,
      value: cumulativeTotal / cumulativeVolume
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
        cumulativeVolume = lastCumulativeVolume;
        cumulativeTotal = lastCumulativeTotal;
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}