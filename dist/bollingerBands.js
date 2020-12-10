"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bollingerBands = bollingerBands;

var _sma = require("./sma");

var _stdev = require("./stdev");

function bollingerBands({
  candles,
  period,
  stdDev
}) {
  let result = [];
  const sma = (0, _sma.SMA)([], period);
  const stdev = (0, _stdev.STDEV)({
    candles: [],
    period
  });

  function calculate(candle) {
    const basis = sma.update(candle);
    const sd = stdev.update(candle);
    if (!basis) return undefined;
    const dev = stdDev * sd.value;
    const upper = basis.value + dev;
    const lower = basis.value - dev;
    const bbr = (candle.close - lower) / (upper - lower);
    return {
      time: candle.time,
      value: bbr,
      candle
    };
  }

  candles.forEach(item => {
    const res = calculate(item);
    if (res) result.push(res);
  });
  return {
    result,
    update: candle => {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
      }

      const item = calculate(candle);
      if (item) result.push(item);
      return item;
    }
  };
}