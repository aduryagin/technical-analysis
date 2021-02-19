"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATR = ATR;

var _rma = require("./rma");

var _trueRange = require("./trueRange");

function ATR(candles, period) {
  var _result = [];
  var tr = (0, _trueRange.trueRange)([]);
  var rma = (0, _rma.RMA)([], period);

  function calculate(candle) {
    var tRange = tr.update(candle);
    if (!tRange) return undefined;
    var tRangeRMA = rma.update({
      time: candle.time,
      close: tRange.value
    });
    if (!tRangeRMA) return undefined;
    return {
      time: candle.time,
      value: tRangeRMA === null || tRangeRMA === void 0 ? void 0 : tRangeRMA.value
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
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}