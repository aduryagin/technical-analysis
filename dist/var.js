"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VAR = VAR;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function sum(arr, length) {
  return arr.slice(-length).reduce(function (acc, item) {
    return acc += item;
  }, 0);
}

function VAR(_ref) {
  var candles = _ref.candles,
      period = _ref.period;
  var _result2 = [];

  var candlesStack = _toConsumableArray(candles);

  var vud1 = [];
  var vdd1 = [];
  var valpha = 2 / (period + 1);

  function calculate(candle, index) {
    var _candlesStack, _result;

    var prevCandlePrice = ((_candlesStack = candlesStack[index - 1]) === null || _candlesStack === void 0 ? void 0 : _candlesStack.close) || 0;
    vud1.push(candle.close > prevCandlePrice ? candle.close - prevCandlePrice : 0);
    vdd1.push(candle.close < prevCandlePrice ? prevCandlePrice - candle.close : 0);
    var vUD = sum(vud1, 9);
    var vDD = sum(vdd1, 9);
    var vCMO = (vUD - vDD) / (vUD + vDD) || 0;
    var VAR = valpha * Math.abs(vCMO) * candle.close + (1 - valpha * Math.abs(vCMO)) * (((_result = _result2[_result2.length - 1]) === null || _result === void 0 ? void 0 : _result.value) || 0);
    return {
      value: VAR,
      time: candle.time
    };
  }

  candlesStack.forEach(function (item, index) {
    var res = calculate(item, index);
    if (res) _result2.push(res);
  });
  return {
    update: function update(candle) {
      if (_result2.length && _result2[_result2.length - 1].time === candle.time) {
        _result2 = _result2.slice(0, -1);
        candlesStack = candlesStack.slice(0, -1);
        vud1 = vud1.slice(0, -1);
        vdd1 = vdd1.slice(0, -1);
      }

      candlesStack.push(candle);
      var item = calculate(candle, candlesStack.length - 1);
      if (item) _result2.push(item);
      return item;
    },
    result: function result() {
      return _result2;
    }
  };
}