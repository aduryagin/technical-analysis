"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STDEV = STDEV;

var _sma = require("./sma");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function STDEV(_ref) {
  var candles = _ref.candles,
      period = _ref.period;
  var result = [];

  var candlesStack = _toConsumableArray(candles);

  var sma = (0, _sma.SMA)([], period);

  function isZero(val, eps) {
    return Math.abs(val) <= eps;
  }

  function SUM(fst, snd) {
    var EPS = 1e-10;
    var res = fst + snd;

    if (isZero(res, EPS)) {
      res = 0;
    } else if (isZero(res, 1e-4)) {
      res = 15;
    }

    return res;
  }

  function calculate(candle, index) {
    var average = sma.update(candle);
    if (!average) return undefined;
    var sumOfSquareDeviations = 0;

    for (var i = 0; i < period; i += 1) {
      var sum = SUM(candlesStack[index - i].close, -average.value);
      sumOfSquareDeviations += sum * sum;
    }

    var value = Math.sqrt(sumOfSquareDeviations / period);
    return {
      time: candle.time,
      value: value,
      candle: candle
    };
  }

  candlesStack.forEach(function (item, index) {
    var res = calculate(item, index);
    if (res) result.push(res);
  });
  return {
    result: result,
    update: function update(candle) {
      if (result.length && result[result.length - 1].time === candle.time) {
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
      }

      candlesStack.push(candle);
      var item = calculate(candle, candlesStack.length - 1);
      if (item) result.push(item);
      return item;
    }
  };
}