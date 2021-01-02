"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PMaxRSI = PMaxRSI;

var _sma = require("./sma");

var _t = require("./t3");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function WWMA(_ref) {
  var source = _ref.source,
      period = _ref.period;
  var result = [];
  var wwalpha = 1 / period;

  function calculate(src) {
    var _result;

    return {
      value: wwalpha * src.value + (1 - wwalpha) * (((_result = result[result.length - 1]) === null || _result === void 0 ? void 0 : _result.value) || 0),
      time: src.time
    };
  }

  source.forEach(function (item) {
    var res = calculate(item);
    if (res) result.push(res);
  });
  return {
    update: function update(src) {
      if (result.length && result[result.length - 1].time === src.time) {
        result = result.slice(0, -1);
      }

      var item = calculate(src);
      if (item) result.push(item);
      return item;
    },
    result: result
  };
}

function PMaxRSI(_ref2) {
  var candles = _ref2.candles,
      rsi = _ref2.rsi,
      t3 = _ref2.t3,
      atr = _ref2.atr;
  candles = candles || [];
  rsi = rsi || {
    period: 14
  };
  t3 = t3 || {
    period: 8,
    volumeFactor: 0.7
  };
  atr = atr || {
    multiplier: 3,
    period: 10
  };
  var result = [];

  var candleStack = _toConsumableArray(candles);

  var t3Instance = (0, _t.T3)({
    candles: [],
    period: t3.period,
    volumeFactor: t3.volumeFactor
  });
  var AvUp = WWMA({
    source: [],
    period: rsi.period
  });
  var AvDown = WWMA({
    source: [],
    period: rsi.period
  });
  var AvUpSMA = (0, _sma.SMA)([], rsi.period);
  var AvDownSMA = (0, _sma.SMA)([], rsi.period);
  var ATR = (0, _sma.SMA)([], atr.period); // stacks

  var longStopPrev;
  var longStopStack = [];
  var dirStackPrev = 1;
  var dirStack = [];
  var shortStopPrev;
  var shortStopStack = [];

  function calculate(candle, index) {
    var _result2, _result3;

    if (!candleStack[index - 1]) return undefined;
    var i = candle.close >= candleStack[index - 1].close ? candle.close - candleStack[index - 1].close : 0;
    var i2 = candle.close < candleStack[index - 1].close ? candleStack[index - 1].close - candle.close : 0;
    var avUpResult = AvUp.update({
      time: candle.time,
      value: i
    });
    var avDownResult = AvDown.update({
      time: candle.time,
      value: i2
    });
    var AvgUpSMAResult = AvUpSMA.update({
      time: candle.time,
      close: i
    });
    var AvgDownSMAResult = AvDownSMA.update({
      time: candle.time,
      close: i2
    });
    if (!AvgDownSMAResult) return undefined;
    var k1 = candle.high > candleStack[index - 1].close ? candle.high - candleStack[index - 1].close : 0;
    var k2 = candle.high < candleStack[index - 1].close ? candleStack[index - 1].close - candle.high : 0;
    var k3 = candle.low > candleStack[index - 1].close ? candle.low - candleStack[index - 1].close : 0;
    var k4 = candle.low < candleStack[index - 1].close ? candleStack[index - 1].close - candle.low : 0;
    var AvgUpH = (AvgUpSMAResult.value * (rsi.period - 1) + k1) / rsi.period;
    var AvgDownH = (AvgDownSMAResult.value * (rsi.period - 1) + k2) / rsi.period;
    var AvgUpL = (AvgUpSMAResult.value * (rsi.period - 1) + k3) / rsi.period;
    var AvgDownL = (AvgDownSMAResult.value * (rsi.period - 1) + k4) / rsi.period;
    var rs = avUpResult.value / avDownResult.value;
    var rsi1 = rs === -1 ? 0 : 100 - 100 / (1 + rs);
    var rsh = AvgUpH / AvgDownH;
    var rsih = rsh === -1 ? 0 : 100 - 100 / (1 + rsh);
    var rsl = AvgUpL / AvgDownL;
    var rsil = rsl === -1 ? 0 : 100 - 100 / (1 + rsl);
    var TR = Math.max(rsih - rsil, Math.abs(rsih - (((_result2 = result[result.length - 1]) === null || _result2 === void 0 ? void 0 : _result2.rsi) || 0)), Math.abs(rsil - (((_result3 = result[result.length - 1]) === null || _result3 === void 0 ? void 0 : _result3.rsi) || 0)));
    var ATRResult = ATR.update({
      time: candle.time,
      close: TR
    });
    var t3Result = t3Instance.update({
      close: rsi1,
      time: candle.time
    });
    if (!ATRResult || !t3Result) return undefined;
    var longStop = t3Result.value - atr.multiplier * ATRResult.value;
    longStopPrev = longStopStack.pop() || longStop;
    longStop = t3Result.value > longStopPrev ? Math.max(longStop, longStopPrev) : longStop;
    longStopStack.push(longStop);
    var shortStop = t3Result.value + atr.multiplier * ATRResult.value;
    shortStopPrev = shortStopStack.pop() || shortStop;
    shortStop = t3Result.value < shortStopPrev ? Math.min(shortStop, shortStopPrev) : shortStop;
    shortStopStack.push(shortStop);
    var dir = 1;
    dirStackPrev = dirStack.pop() || dir;
    dir = dirStackPrev;
    dir = // eslint-disable-next-line no-nested-ternary
    dir === -1 && t3Result.value > shortStopPrev ? 1 : dir === 1 && t3Result.value < longStopPrev ? -1 : dir;
    dirStack.push(dir);
    return {
      candle: candle,
      time: candle.time,
      rsi: rsi1,
      t3: t3Result.value,
      pmax: dir === 1 ? longStop : shortStop
    };
  }

  candleStack.forEach(function (item, index) {
    var res = calculate(item, index);
    if (res) result.push(res);
  });
  return {
    result: result,
    update: function update(candle) {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        candleStack = candleStack.slice(0, -1);
        longStopStack = [longStopPrev];
        dirStack = [dirStackPrev];
        shortStopStack = [shortStopPrev];
      }

      candleStack.push(candle);
      var item = calculate(candle, candleStack.length - 1);
      if (item) result.push(item);
      return item;
    }
  };
}