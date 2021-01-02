"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSI = RSI;

var _averageGain = require("./averageGain");

var _averageLoss = require("./averageLoss");

function RSI(_ref) {
  var candles = _ref.candles,
      period = _ref.period;
  var result = [];
  var avgGain = (0, _averageGain.averageGain)([], period);
  var avgLoss = (0, _averageLoss.averageLoss)([], period);

  function calculate(candle) {
    var currentRSI;
    var RS;
    var lastAvgLoss = avgLoss.update(candle);
    var lastAvgGain = avgGain.update(candle);

    if (lastAvgGain && lastAvgLoss) {
      if (lastAvgLoss.value === 0) {
        currentRSI = 100;
      } else if (lastAvgGain.value === 0) {
        currentRSI = 0;
      } else {
        RS = lastAvgGain.value / lastAvgLoss.value; // eslint-disable-next-line no-restricted-globals

        RS = isNaN(RS) ? 0 : RS;
        currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
      }

      return {
        time: candle.time,
        value: currentRSI,
        candle: candle
      };
    }

    return undefined;
  }

  candles.forEach(function (candle) {
    var item = calculate(candle);
    if (item) result.push(item);
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