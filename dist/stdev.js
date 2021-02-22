(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sma"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STDEV = void 0;
    const sma_1 = require("./sma");
    function STDEV({ candles, period }) {
        let result = [];
        let candlesStack = [...candles];
        const sma = sma_1.SMA({ candles: [], period });
        function isZero(val, eps) {
            return Math.abs(val) <= eps;
        }
        function SUM(fst, snd) {
            const EPS = 1e-10;
            let res = fst + snd;
            if (isZero(res, EPS)) {
                res = 0;
            }
            else if (isZero(res, 1e-4)) {
                res = 15;
            }
            return res;
        }
        function calculate(candle, index) {
            const average = sma.update(candle);
            if (!average)
                return undefined;
            let sumOfSquareDeviations = 0;
            for (let i = 0; i < period; i += 1) {
                const sum = SUM(candlesStack[index - i].close, -average.value);
                sumOfSquareDeviations += sum * sum;
            }
            const value = Math.sqrt(sumOfSquareDeviations / period);
            return { time: candle.time, value, candle };
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
                }
                candlesStack.push(candle);
                const item = calculate(candle, candlesStack.length - 1);
                if (item)
                    result.push(item);
                return item;
            },
        };
    }
    exports.STDEV = STDEV;
});
