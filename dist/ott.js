"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OTT = OTT;

var _var = require("./var");

function OTT(_ref) {
  var candles = _ref.candles,
      period = _ref.period,
      percent = _ref.percent;
  period = period || 2;
  percent = percent || 1.4;
  var _result = [];
  var varInstance = (0, _var.VAR)({
    candles: [],
    period: period
  }); // stacks

  var longStopPrev;
  var longStopStack = [];
  var dirStackPrev = 1;
  var dirStack = [];
  var shortStopPrev;
  var shortStopStack = [];
  var ottStack = [];

  function calculate(candle) {
    var varResult = varInstance.update(candle);
    if (!varResult) return undefined;
    var fark = varResult.value * percent * 0.01;
    var longStop = varResult.value - fark;
    longStopPrev = longStopStack.pop() || longStop;
    longStop = varResult.value > longStopPrev ? Math.max(longStop, longStopPrev) : longStop;
    longStopStack.push(longStop);
    var shortStop = varResult.value + fark;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop = varResult.value < shortStopPrev ? Math.min(shortStop, shortStopPrev) : shortStop;
    shortStopStack.push(shortStop);
    var dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir = // eslint-disable-next-line no-nested-ternary
    dir === -1 && varResult.value > shortStopPrev ? 1 : dir === 1 && varResult.value < longStopPrev ? -1 : dir;
    dirStack.push(dir);
    var MT = dir === 1 ? longStop : shortStop;
    ottStack.push(varResult.value > MT ? MT * (200 + percent) / 200 : MT * (200 - percent) / 200);
    var OTT = ottStack[ottStack.length - 3] || 0;
    return {
      candle: candle,
      var: varResult.value,
      ott: OTT,
      time: candle.time
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
        ottStack = ottStack.slice(0, -1);
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}