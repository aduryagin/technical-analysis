"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMA = SMA;

function SMA(candles, period) {
  var _result = [];
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
        value: sum / period,
        candle: candle
      };
    }

    return undefined;
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
      if (item) _result.push(item);
      return item;
    }
  };
}