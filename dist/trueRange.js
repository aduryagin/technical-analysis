(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trueRange = void 0;
    function trueRange({ candles }) {
        let result = [];
        let previousClose;
        let prevPrevClose;
        let trueRangeResult;
        function calculate(candle) {
            if (previousClose === undefined) {
                previousClose = candle.close;
                return { time: candle.time, value: candle.high - candle.low };
            }
            trueRangeResult = Math.max(candle.high - candle.low, isNaN(Math.abs(candle.high - previousClose))
                ? 0
                : Math.abs(candle.high - previousClose), isNaN(Math.abs(candle.low - previousClose))
                ? 0
                : Math.abs(candle.low - previousClose));
            prevPrevClose = previousClose;
            previousClose = candle.close;
            return { time: candle.time, value: trueRangeResult };
        }
        candles.forEach((item) => {
            const res = calculate(item);
            if (res)
                result.push(res);
        });
        return {
            result: () => result,
            update: (candle) => {
                if (result.length && result[result.length - 1].time === candle.time) {
                    result = result.slice(0, -1);
                    previousClose = prevPrevClose;
                }
                const item = calculate(candle);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.trueRange = trueRange;
});
