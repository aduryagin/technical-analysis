"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WWMA = WWMA;

function WWMA(_ref) {
  var source = _ref.source,
      period = _ref.period;
  var _result2 = [];
  var wwalpha = 1 / period;

  function calculate(src) {
    var _result;

    return {
      value: wwalpha * src.value + (1 - wwalpha) * (((_result = _result2[_result2.length - 1]) === null || _result === void 0 ? void 0 : _result.value) || 0),
      time: src.time
    };
  }

  source.forEach(function (item) {
    var res = calculate(item);
    if (res) _result2.push(res);
  });
  return {
    update: function update(src) {
      if (_result2.length && _result2[_result2.length - 1].time === src.time) {
        _result2 = _result2.slice(0, -1);
      }

      var item = calculate(src);
      if (item) _result2.push(item);
      return item;
    },
    result: function result() {
      return _result2;
    }
  };
}