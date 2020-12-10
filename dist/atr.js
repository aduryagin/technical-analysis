"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATR = ATR;

var _rma = require("./rma");

var _trueRange = require("./trueRange");

function ATR(candles, period) {
  let result = [];
  const tr = (0, _trueRange.trueRange)([]);
  const rma = (0, _rma.RMA)([], period);

  function calculate(candle) {
    const tRange = tr.update(candle);
    if (!tRange) return undefined;
    const tRangeRMA = rma.update({
      time: candle.time,
      close: tRange.value
    });
    if (!tRangeRMA) return undefined;
    return {
      time: candle.time,
      value: tRangeRMA?.value
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