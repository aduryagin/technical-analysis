"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.T3 = T3;

var _ema = require("./ema");

function T3(_ref) {
  var candles = _ref.candles,
      period = _ref.period,
      volumeFactor = _ref.volumeFactor;
  var result = [];
  var T3e1 = (0, _ema.EMA)([], period);
  var T3e2 = (0, _ema.EMA)([], period);
  var T3e3 = (0, _ema.EMA)([], period);
  var T3e4 = (0, _ema.EMA)([], period);
  var T3e5 = (0, _ema.EMA)([], period);
  var T3e6 = (0, _ema.EMA)([], period);

  function calculate(candle) {
    var T3e1Result = T3e1.update(candle);
    if (!T3e1Result) return undefined;
    var T3e2Result = T3e2.update({
      close: T3e1Result.value,
      time: T3e1Result.time
    });
    if (!T3e2Result) return undefined;
    var T3e3Result = T3e3.update({
      close: T3e2Result.value,
      time: T3e2Result.time
    });
    if (!T3e3Result) return undefined;
    var T3e4Result = T3e4.update({
      close: T3e3Result.value,
      time: T3e3Result.time
    });
    if (!T3e4Result) return undefined;
    var T3e5Result = T3e5.update({
      close: T3e4Result.value,
      time: T3e4Result.time
    });
    if (!T3e5Result) return undefined;
    var T3e6Result = T3e6.update({
      close: T3e5Result.value,
      time: T3e5Result.time
    });
    if (!T3e6Result) return undefined;
    var T3c1 = -volumeFactor * volumeFactor * volumeFactor;
    var T3c2 = 3 * volumeFactor * volumeFactor + 3 * volumeFactor * volumeFactor * volumeFactor;
    var T3c3 = -6 * volumeFactor * volumeFactor - 3 * volumeFactor - 3 * volumeFactor * volumeFactor * volumeFactor;
    var T3c4 = 1 + 3 * volumeFactor + volumeFactor * volumeFactor * volumeFactor + 3 * volumeFactor * volumeFactor;
    var T3 = T3c1 * T3e6Result.value + T3c2 * T3e5Result.value + T3c3 * T3e4Result.value + T3c4 * T3e3Result.value;
    return {
      value: T3,
      time: candle.time
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