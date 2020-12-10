"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMA = SMA;

function SMA(candles, period) {
  var result = [];
  var list = [0];
  var counter = 1;
  var sum = 0;
  var shifted;
  var prevSum;
  var lastCandle;

  function calculate(candle) {
    var current = candle.close;
    lastCandle = candle;

    if (counter < period) {
      counter += 1;
      list.push(current);
      sum += current;
    } else {
      prevSum = sum;
      shifted = list.shift();
      sum = sum - shifted + current;
      list.push(current);
      return {
        time: candle.time,
        value: sum / period
      };
    }

    return undefined;
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
        list.pop();

        if (counter < period) {
          counter -= 1;
          sum -= lastCandle.close;
        } else {
          sum = prevSum;
          list.unshift(shifted);
        }
      }

      var item = calculate(candle);
      if (item) result.push(item);
      return item;
    }
  };
}