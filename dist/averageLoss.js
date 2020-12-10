"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.averageLoss = averageLoss;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function averageLoss(candles, period) {
  var counter = 1;
  var lossSum = 0;
  var loss = 0;

  var candlesStack = _toConsumableArray(candles);

  var result = [];

  function calculate(candle, lastCandle) {
    var currentValue = candle.close;
    var lastValue = lastCandle.close;
    loss = lastValue - currentValue;
    loss = loss > 0 ? loss : 0;

    if (loss > 0) {
      lossSum += loss;
    }

    if (counter < period) {
      counter += 1;
    } else if (result.length === 0) {
      return {
        time: candle.time,
        value: lossSum / period
      };
    } else {
      return {
        time: candle.time,
        value: (result[result.length - 1].value * (period - 1) + loss) / period
      };
    }

    return undefined;
  }

  candlesStack.forEach(function (candle, index) {
    if (index !== 0) {
      var item = calculate(candle, candlesStack[index - 1]);
      if (item) result.push(item);
    }
  });
  return {
    result: result,
    update: function update(candle) {
      if (result.length && result[result.length - 1].time === candle.time) {
        lossSum -= loss;
        result = result.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
      }

      if (candlesStack.length) {
        var item = calculate(candle, candlesStack[candlesStack.length - 1]);
        candlesStack.push(candle);
        if (item) result.push(item);
        return item;
      }

      candlesStack.push(candle);
      return undefined;
    }
  };
}