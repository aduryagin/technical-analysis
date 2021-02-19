"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMA = EMA;

var _sma = require("./sma");

function EMA(_ref) {
  var candles = _ref.candles,
      period = _ref.period;
  var _result = [];
  var sma = (0, _sma.SMA)([], period);
  var exponent = 2 / (period + 1);
  var prevPrevEma;
  var prevEma;

  function calculate(candle) {
    var _sma$update;

    prevPrevEma = prevEma;

    if (prevEma !== undefined) {
      prevEma = (candle.close - prevEma) * exponent + prevEma;
      return {
        value: prevEma,
        time: candle.time
      };
    }

    prevEma = (_sma$update = sma.update(candle)) === null || _sma$update === void 0 ? void 0 : _sma$update.value;
    if (prevEma !== undefined) return {
      value: prevEma,
      time: candle.time
    };
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
        prevEma = prevPrevEma;
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}