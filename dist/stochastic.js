"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stochastic = stochastic;

var _sma = require("./sma");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function stochastic(_ref) {
  var candles = _ref.candles,
      signalPeriod = _ref.signalPeriod,
      period = _ref.period;
  var _result = [];
  var sma = (0, _sma.SMA)([], signalPeriod);
  var pastHighPeriods = [];
  var pastLowPeriods = [];
  var k;
  var d;
  var index = 1;
  var lastCandle;

  function calculate(candle) {
    lastCandle = candle;
    pastHighPeriods.push(candle.high);
    pastLowPeriods.push(candle.low);

    if (index >= period) {
      var _sma$update;

      var periodLow = Math.min.apply(Math, _toConsumableArray(pastLowPeriods.slice(-period)));
      var periodHigh = Math.max.apply(Math, _toConsumableArray(pastHighPeriods.slice(-period)));
      k = (candle.close - periodLow) / (periodHigh - periodLow) * 100; // eslint-disable-next-line no-restricted-globals

      k = isNaN(k) ? 0 : k;
      d = (_sma$update = sma.update({
        time: candle.time,
        close: k
      })) === null || _sma$update === void 0 ? void 0 : _sma$update.value;
      return {
        k: k,
        d: d,
        time: candle.time
      };
    }

    index += 1;
    return undefined;
  }

  candles.forEach(function (candle) {
    var item = calculate(candle);
    if (item) _result.push(item);
  });
  return {
    result: function result() {
      return _result;
    },
    update: function update(candle) {
      if (_result.length && _result[_result.length - 1].time === candle.time) {
        _result = _result.slice(0, -1);
      }

      if (lastCandle && lastCandle.time === candle.time) {
        pastLowPeriods.pop();
        pastHighPeriods.pop();

        if (index < period) {
          index -= 1;
        }
      }

      var item = calculate(candle);
      if (item) _result.push(item);
      return item;
    }
  };
}