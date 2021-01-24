"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WWMA = WWMA;

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