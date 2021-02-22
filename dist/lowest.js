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
    exports.lowest = void 0;
    function lowest({ candles, period }) {
        let result = [];
        let candlesStack = [...candles];
        let low = null;
        let prevLow = null;
        function calculate(candle, index) {
            if (index + 1 < period)
                return;
            prevLow = low;
            low = Math.min(...candlesStack
                .slice(index + 1 - period, index + 1)
                .reduce((accum, item) => [...accum, item.close], []));
            return { time: candle.time, value: low };
        }
        candlesStack.forEach((item, index) => {
            const res = calculate(item, index);
            if (res)
                result.push(res);
        });
        return {
            result: () => result,
            update: (candle) => {
                if (result.length && result[result.length - 1].time === candle.time) {
                    result = result.slice(0, -1);
                    candlesStack = candlesStack.slice(0, -1);
                    low = prevLow;
                }
                candlesStack.push(candle);
                const item = calculate(candle, candlesStack.length - 1);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.lowest = lowest;
});
