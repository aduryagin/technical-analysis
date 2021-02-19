"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PMax = PMax;

var _ema = require("./ema");

var _atr = require("./atr");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function PMax(_ref) {
  var candles = _ref.candles,
      _ref$emaPeriod = _ref.emaPeriod,
      emaPeriod = _ref$emaPeriod === void 0 ? 10 : _ref$emaPeriod,
      _ref$atrPeriod = _ref.atrPeriod,
      atrPeriod = _ref$atrPeriod === void 0 ? 10 : _ref$atrPeriod,
      _ref$multiplier = _ref.multiplier,
      multiplier = _ref$multiplier === void 0 ? 3 : _ref$multiplier;
  var _result = [];
  var ema = (0, _ema.EMA)({
    candles: [],
    period: emaPeriod
  });
  var atr = (0, _atr.ATR)([], atrPeriod); // stacks

  var longStopPrev;
  var longStopStack = [];
  var dirStackPrev = 1;
  var dirStack = [];
  var shortStopPrev;
  var shortStopStack = [];

  function calculate(candle) {
    var emaResult = ema.update(_objectSpread(_objectSpread({}, candle), {}, {
      close: (candle.low + candle.high) / 2
    }));
    var atrResult = atr.update(candle);
    if (!emaResult || !atrResult) return undefined;
    var longStop = emaResult.value - multiplier * atrResult.value;
    longStopPrev = longStopStack.pop() || longStop;
    longStop = emaResult.value > longStopPrev ? Math.max(longStop, longStopPrev) : longStop;
    longStopStack.push(longStop);
    var shortStop = emaResult.value + multiplier * atrResult.value;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop = emaResult.value < shortStopPrev ? Math.min(shortStop, shortStopPrev) : shortStop;
    shortStopStack.push(shortStop);
    var dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir = // eslint-disable-next-line no-nested-ternary
    dir === -1 && emaResult.value > shortStopPrev ? 1 : dir === 1 && emaResult.value < longStopPrev ? -1 : dir;
    dirStack.push(dir);
    return {
      candle: candle,
      time: candle.time,
      ema: emaResult.value,
      pmax: dir === 1 ? longStop : shortStop,
      pmaxReverse: dir === 1 ? shortStop : longStop,
      pmaxLong: longStop,
      pmaxShort: shortStop
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
        longStopStack = [longStopPrev];
        dirStack = [dirStackPrev];
        shortStopStack = [shortStopPrev];
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}